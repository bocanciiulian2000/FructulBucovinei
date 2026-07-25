'use strict'

const crypto = require('crypto')
const fs = require('fs')

const SANDBOX_ENDPOINT = 'https://sandboxsecure.mobilpay.ro'
const LIVE_ENDPOINT = 'https://secure.mobilpay.ro'
const PAYMENT_CIPHER = 'aes-256-cbc'

function getConfiguredValue(...names) {
  for (const name of names) {
    const value = String(process.env[name] || '').trim()

    if (value) {
      return value
    }
  }

  return ''
}

function readKey({ valueNames, base64Names, pathNames, label }) {
  const directValue = getConfiguredValue(...valueNames)

  if (directValue) {
    return directValue.replace(/\\n/g, '\n')
  }

  const base64Value = getConfiguredValue(...base64Names)

  if (base64Value) {
    return Buffer.from(base64Value, 'base64').toString('utf8')
  }

  const keyPath = getConfiguredValue(...pathNames)

  if (keyPath) {
    try {
      return fs.readFileSync(keyPath, 'utf8')
    } catch (error) {
      throw new Error(`Nu am putut citi ${label}: ${error.message}`)
    }
  }

  throw new Error(`Lipsește configurația NETOPIA pentru ${label}.`)
}

function getNetopiaConfig() {
  const environment = getConfiguredValue('NETOPIA_ENVIRONMENT') || 'sandbox'
  const isLive = environment.toLowerCase() === 'live' || environment.toLowerCase() === 'production'
  const signature = getConfiguredValue('NETOPIA_POS_SIGNATURE', 'NETOPIA_SIGNATURE')

  if (!signature) {
    throw new Error('Lipsește NETOPIA_POS_SIGNATURE.')
  }

  const privateKey = readKey({
    valueNames: ['NETOPIA_PRIVATE_KEY'],
    base64Names: ['NETOPIA_PRIVATE_KEY_BASE64'],
    pathNames: ['NETOPIA_PRIVATE_KEY_PATH'],
    label: 'cheia privată NETOPIA',
  })
  const publicCertificate = readKey({
    valueNames: ['NETOPIA_PUBLIC_CERT', 'NETOPIA_PUBLIC_KEY'],
    base64Names: ['NETOPIA_PUBLIC_CERT_BASE64', 'NETOPIA_PUBLIC_KEY_BASE64'],
    pathNames: ['NETOPIA_PUBLIC_CERT_PATH', 'NETOPIA_PUBLIC_KEY_PATH'],
    label: 'certificatul public NETOPIA',
  })

  try {
    crypto.createPrivateKey(privateKey)
    crypto.createPublicKey(publicCertificate)
  } catch (error) {
    throw new Error(`Cheile NETOPIA nu sunt valide: ${error.message}`)
  }

  return {
    environment,
    endpoint: getConfiguredValue('NETOPIA_ENDPOINT') || (isLive ? LIVE_ENDPOINT : SANDBOX_ENDPOINT),
    signature,
    privateKey,
    publicCertificate,
  }
}

function assertNetopiaConfigured() {
  getNetopiaConfig()
}

function escapeXml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function formatTimestamp(date = new Date()) {
  const pad = (value) => String(value).padStart(2, '0')

  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join('')
}

function formatAddress(address) {
  return [
    address.streetAddress,
    address.addressExtra,
    address.city,
    address.county,
    address.postalCode,
    address.country,
  ].filter(Boolean).join(', ')
}

function buildContactInfo(address) {
  const type = address.company ? 'company' : 'person'

  return `
        <billing type="${type}">
          <first_name>${escapeXml(address.firstName)}</first_name>
          <last_name>${escapeXml(address.lastName)}</last_name>
          <email>${escapeXml(address.email || '')}</email>
          <address>${escapeXml(formatAddress(address))}</address>
          <mobile_phone>${escapeXml(address.phone)}</mobile_phone>
        </billing>`
}

function buildPaymentXml({ order, billingAddress, shippingAddress, siteBaseUrl, paymentReturnToken }) {
  const config = getNetopiaConfig()
  const returnUrl = `${siteBaseUrl}/comanda-primita?order=${encodeURIComponent(order.orderNumber)}&payment=card&token=${encodeURIComponent(paymentReturnToken)}`
  const confirmUrl = getConfiguredValue('NETOPIA_CONFIRM_URL', 'PAYMENT_CONFIRM_URL') || `${siteBaseUrl}/api/payments/netopia/confirm`
  const amount = Number(order.totalAmount).toFixed(2)
  const details = `Fructul Bucovinei - ${order.orderNumber}`

  return `<?xml version="1.0" encoding="utf-8"?>
<order type="card" id="${escapeXml(order.orderNumber)}" timestamp="${formatTimestamp()}">
  <signature>${escapeXml(config.signature)}</signature>
  <invoice currency="${escapeXml(order.currency || 'RON')}" amount="${escapeXml(amount)}">
    <details>${escapeXml(details)}</details>
    <contact_info>${buildContactInfo({ ...billingAddress, email: order.customerEmail })}
      ${shippingAddress ? buildContactInfo({ ...shippingAddress, email: order.customerEmail }).replace('<billing ', '<shipping ').replace('</billing>', '</shipping>') : ''}
    </contact_info>
  </invoice>
  <ipn_cipher>${PAYMENT_CIPHER}</ipn_cipher>
  <params>
    <param>
      <name>order_number</name>
      <value>${escapeXml(order.orderNumber)}</value>
    </param>
  </params>
  <url>
    <confirm>${escapeXml(confirmUrl)}</confirm>
    <return>${escapeXml(returnUrl)}</return>
  </url>
</order>`
}

function encryptPaymentXml(xml) {
  const config = getNetopiaConfig()
  const symmetricKey = crypto.randomBytes(32)
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(PAYMENT_CIPHER, symmetricKey, iv)
  const encryptedData = Buffer.concat([
    cipher.update(Buffer.from(xml, 'utf8')),
    cipher.final(),
  ]).toString('base64')
  const encryptedKey = crypto.publicEncrypt({
    key: config.publicCertificate,
    padding: crypto.constants.RSA_PKCS1_PADDING,
  }, symmetricKey)

  return {
    endpoint: config.endpoint,
    fields: {
      env_key: encryptedKey.toString('base64'),
      data: encryptedData,
      cipher: PAYMENT_CIPHER,
      iv: iv.toString('base64'),
    },
  }
}

function createPaymentRequest(input) {
  const xml = buildPaymentXml(input)
  return encryptPaymentXml(xml)
}

function decryptNotification({ envKey, data, cipher = PAYMENT_CIPHER, iv }) {
  if (!envKey || !data || !iv) {
    throw new Error('Răspunsul NETOPIA nu conține toate câmpurile criptografice necesare.')
  }

  if (cipher !== PAYMENT_CIPHER) {
    throw new Error(`Algoritmul NETOPIA primit nu este acceptat: ${cipher}`)
  }

  const config = getNetopiaConfig()
  const symmetricKey = crypto.privateDecrypt({
    key: config.privateKey,
    padding: crypto.constants.RSA_PKCS1_PADDING,
  }, Buffer.from(envKey, 'base64'))
  const decipher = crypto.createDecipheriv(cipher, symmetricKey, Buffer.from(iv, 'base64'))

  return Buffer.concat([
    decipher.update(Buffer.from(data, 'base64')),
    decipher.final(),
  ]).toString('utf8')
}

function decodeXml(value) {
  return String(value || '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .trim()
}

function getAttribute(attributes, name) {
  const match = String(attributes || '').match(new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`, 'i'))
  return match ? decodeXml(match[1]) : ''
}

function getElementText(xml, name) {
  const match = String(xml || '').match(new RegExp(`<${name}\\b[^>]*>([\\s\\S]*?)<\\/${name}>`, 'i'))
  return match ? decodeXml(match[1].replace(/<[^>]+>/g, '')) : ''
}

function parseNetopiaResponse(xml) {
  const orderMatch = String(xml || '').match(/<order\b([^>]*)>/i)
  const mobilpayMatch = String(xml || '').match(/<mobilpay\b([^>]*)>([\s\S]*?)<\/mobilpay>/i)

  if (!orderMatch || !mobilpayMatch) {
    throw new Error('Răspunsul NETOPIA nu are structura XML așteptată.')
  }

  const mobilpayXml = mobilpayMatch[2]
  const errorMatch = mobilpayXml.match(/<error\b([^>]*?)(?:\/\s*>|>([\s\S]*?)<\/error>)/i)
  const errorAttributes = errorMatch ? errorMatch[1] : ''
  const errorCode = Number.parseInt(getAttribute(errorAttributes, 'code') || '0', 10)

  return {
    orderId: getAttribute(orderMatch[1], 'id'),
    action: getElementText(mobilpayXml, 'action').toLowerCase(),
    crc: getAttribute(mobilpayMatch[1], 'crc'),
    purchase: getElementText(mobilpayXml, 'purchase'),
    originalAmount: getElementText(mobilpayXml, 'original_amount'),
    processedAmount: getElementText(mobilpayXml, 'processed_amount'),
    errorCode: Number.isNaN(errorCode) ? 99 : errorCode,
    errorMessage: errorMatch ? decodeXml((errorMatch[2] || '').replace(/<[^>]+>/g, '')) : '',
  }
}

function buildConfirmationResponse({ crc, errorType, errorCode, message }) {
  if (errorType) {
    return `<?xml version="1.0" encoding="utf-8"?><crc error_type="${escapeXml(errorType)}" error_code="${escapeXml(errorCode || '500')}">${escapeXml(message || 'Eroare internă')}</crc>`
  }

  return `<?xml version="1.0" encoding="utf-8"?><crc>${escapeXml(crc || 'OK')}</crc>`
}

module.exports = {
  assertNetopiaConfigured,
  buildConfirmationResponse,
  createPaymentRequest,
  decryptNotification,
  parseNetopiaResponse,
}
