const crypto = require('crypto')
const { URL } = require('url')
const mysql = require('mysql2/promise')
const nodemailer = require('nodemailer')
const QRCode = require('qrcode')
const { createClient: createRedisClient } = require('redis')
const {
  generateSecret: generateTotpSecret,
  generateURI: generateTotpUri,
  verify: verifyTotpToken,
} = require('otplib')
const {
  assertNetopiaConfigured,
  buildConfirmationResponse,
  createPaymentRequest,
  decryptNotification,
  parseNetopiaResponse,
} = require('./netopia')

let httpModule
let usingUnitHttp = false

try {
  httpModule = require('unit-http')
  usingUnitHttp = true
} catch {
  httpModule = require('http')
}

const AUTH_COOKIE_NAME = 'fructul-bucovinei-session'
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30
const TWO_FACTOR_CHALLENGE_TTL_SECONDS = 60 * 5
const EMAIL_VERIFICATION_TTL_MINUTES = 30
const PASSWORD_RESET_TTL_MINUTES = 30
const PAYMENT_RETURN_TTL_SECONDS = 60 * 60 * 24 * 7
const FAN_COURIER_TRACKING_URL = 'https://www.fancourier.ro/awb-tracking/'

let dbClient = null
let mailTransporter = null
let redisClient = null
let redisConnectPromise = null
let redisUnavailableUntil = 0
const rateLimitBuckets = new Map()

const RATE_LIMIT_RULES = [
  { method: 'POST', path: '/api/auth/register', limit: 3, windowMs: 60 * 60 * 1000 },
  { method: 'POST', path: '/api/auth/login', limit: 8, windowMs: 15 * 60 * 1000 },
  { method: 'POST', path: '/api/auth/login/2fa', limit: 8, windowMs: 15 * 60 * 1000 },
  { method: 'POST', path: '/api/auth/forgot-password', limit: 3, windowMs: 30 * 60 * 1000 },
  { method: 'POST', path: '/api/auth/reset-password', limit: 6, windowMs: 30 * 60 * 1000 },
  { method: 'POST', path: '/api/auth/verify-email', limit: 10, windowMs: 30 * 60 * 1000 },
  { method: 'POST', path: '/api/auth/2fa/setup', limit: 5, windowMs: 60 * 60 * 1000 },
  { method: 'POST', path: '/api/auth/2fa/verify', limit: 8, windowMs: 15 * 60 * 1000 },
  { method: 'POST', path: '/api/auth/2fa/disable', limit: 5, windowMs: 60 * 60 * 1000 },
  { method: 'POST', path: '/api/orders', limit: 12, windowMs: 60 * 60 * 1000 },
]

function requiredEnv(name) {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing ${name} environment variable.`)
  }

  return value
}

function getDbClient() {
  if (!dbClient) {
    dbClient = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: requiredEnv('DB_USER'),
      password: requiredEnv('DB_PASSWORD'),
      database: requiredEnv('DB_NAME'),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    })
  }

  return dbClient
}

async function getRedisClient() {
  const socketPath = process.env.REDIS_SOCKET_PATH

  if (!socketPath) {
    return null
  }

  const now = Date.now()

  if (redisUnavailableUntil > now) {
    return null
  }

  if (redisClient?.isOpen) {
    return redisClient
  }

  if (!redisConnectPromise) {
    redisClient = createRedisClient({
      socket: {
        path: socketPath,
      },
      database: Number(process.env.REDIS_DB || 0),
    })

    redisClient.on('error', (error) => {
      console.error('Redis error:', error)
    })

    redisConnectPromise = redisClient.connect()
  }

  try {
    await redisConnectPromise
    return redisClient
  } catch (error) {
    console.error('Redis connection failed, falling back to memory rate limit:', error)
    redisClient = null
    redisConnectPromise = null
    redisUnavailableUntil = Date.now() + 60 * 1000
    return null
  }
}

function getFirstConfiguredUrl(...values) {
  for (const value of values) {
    const firstValue = String(value || '').split(',')[0].trim()

    if (firstValue) {
      return firstValue.replace(/\/$/, '')
    }
  }

  return ''
}

function getSiteBaseUrl() {
  return getFirstConfiguredUrl(
    process.env.PUBLIC_SITE_URL,
    process.env.SITE_URL,
    process.env.FRONTEND_ORIGIN,
    process.env.FRONTEND_ORIGINS,
    'https://fructulbucovinei.ro'
  )
}

function getClientIp(request) {
  const forwardedFor = String(request.headers['x-forwarded-for'] || '')
    .split(',')[0]
    .trim()
  const realIp = String(request.headers['x-real-ip'] || '').trim()
  const cfIp = String(request.headers['cf-connecting-ip'] || '').trim()

  return forwardedFor || cfIp || realIp || request.socket?.remoteAddress || 'unknown'
}

function findRateLimitRule(method, routePath) {
  return RATE_LIMIT_RULES.find((rule) => (
    rule.method === method &&
    (typeof rule.path === 'string' ? rule.path === routePath : rule.path.test(routePath))
  ))
}

function cleanupRateLimitBuckets(now) {
  if (rateLimitBuckets.size < 500) {
    return
  }

  for (const [key, bucket] of rateLimitBuckets.entries()) {
    if (bucket.resetAt <= now) {
      rateLimitBuckets.delete(key)
    }
  }
}

function createRateLimitKey(rule, ip) {
  const digest = crypto
    .createHash('sha256')
    .update(`${rule.method}:${String(rule.path)}:${ip}`)
    .digest('hex')
    .slice(0, 32)

  return `fb:rate-limit:${digest}`
}

function sendRateLimitExceeded(response, request, retryAfterSeconds) {
  sendJson(
    response,
    request,
    429,
    { error: 'Prea multe încercări. Te rugăm să încerci din nou puțin mai târziu.' },
    { 'Retry-After': String(retryAfterSeconds) }
  )
}

function checkMemoryRateLimit(request, response, rule, ip) {
  const now = Date.now()
  cleanupRateLimitBuckets(now)

  const key = `${rule.method}:${rule.path}:${ip}`
  const currentBucket = rateLimitBuckets.get(key)
  const bucket = currentBucket && currentBucket.resetAt > now
    ? currentBucket
    : { count: 0, resetAt: now + rule.windowMs }

  bucket.count += 1
  rateLimitBuckets.set(key, bucket)

  if (bucket.count <= rule.limit) {
    return true
  }

  const retryAfterSeconds = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000))
  sendRateLimitExceeded(response, request, retryAfterSeconds)
  return false
}

async function checkRedisRateLimit(request, response, rule, ip) {
  const client = await getRedisClient()

  if (!client) {
    return null
  }

  const key = createRateLimitKey(rule, ip)
  const windowSeconds = Math.max(1, Math.ceil(rule.windowMs / 1000))

  try {
    const count = await client.incr(key)

    if (count === 1) {
      await client.expire(key, windowSeconds)
    }

    if (count <= rule.limit) {
      return true
    }

    let ttl = await client.ttl(key)

    if (ttl < 1) {
      ttl = windowSeconds
      await client.expire(key, windowSeconds)
    }

    sendRateLimitExceeded(response, request, ttl)
    return false
  } catch (error) {
    console.error('Redis rate limit failed, falling back to memory rate limit:', error)
    redisUnavailableUntil = Date.now() + 60 * 1000
    return null
  }
}

async function checkRateLimit(request, response, routePath) {
  const rule = findRateLimitRule(request.method, routePath)

  if (!rule) {
    return true
  }

  const ip = getClientIp(request)
  const redisResult = await checkRedisRateLimit(request, response, rule, ip)

  if (redisResult !== null) {
    return redisResult
  }

  return checkMemoryRateLimit(request, response, rule, ip)
}

function hashVerificationToken(token) {
  return crypto.createHash('sha256').update(String(token || '')).digest('hex')
}

function createEmailVerificationToken() {
  return crypto.randomBytes(32).toString('base64url')
}

function createPasswordResetToken() {
  return crypto.randomBytes(32).toString('base64url')
}

async function deleteExpiredUnverifiedUsers(db = getDbClient()) {
  await db.execute(
    `DELETE FROM users
     WHERE email_verified_at IS NULL
       AND email_verification_expires_at IS NOT NULL
       AND email_verification_expires_at < NOW()`
  )
}

async function clearExpiredPasswordResetTokens(db = getDbClient()) {
  await db.execute(
    `UPDATE users
     SET password_reset_token_hash = NULL,
         password_reset_expires_at = NULL,
         password_reset_sent_at = NULL,
         updated_at = CURRENT_TIMESTAMP
     WHERE password_reset_expires_at IS NOT NULL
       AND password_reset_expires_at < NOW()`
  )
}

function getMailTransporter() {
  if (mailTransporter) {
    return mailTransporter
  }

  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || 587)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASSWORD

  if (!host || !user || !pass) {
    throw new Error('Missing SMTP configuration.')
  }

  mailTransporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  })

  return mailTransporter
}

function getTransactionalEmailFooterText(note) {
  return [
    note,
    '',
    'Acesta este un mesaj tranzacțional/administrativ, transmis pentru gestionarea și securitatea contului tău. Nu este comunicare comercială.',
    'Operator date: FRUCTUL BUCOVINEI SRL, Sat Rădășeni, Str. Părului 1, județul Suceava, CUI 38785393.',
    'Prelucrăm datele tale strict pentru gestionarea contului, procesarea comenzii, livrare, facturare, suport și îndeplinirea obligațiilor legale.',
    'Ai drept de acces, rectificare, ștergere, restricționare, portabilitate, opoziție și dreptul de a depune o plângere la autoritatea de supraveghere, în condițiile GDPR.',
    `Politica de confidențialitate: ${getSiteBaseUrl()}/politica-de-confidentialitate`,
    'Contact pentru date personale: contact@fructulbucovinei.ro.',
  ]
}

function formatMoney(value, currency = 'RON') {
  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0))
}

function getPaymentMethodLabel(paymentMethod) {
  return paymentMethod === 'card' ? 'Plată online cu cardul' : 'Numerar la livrare'
}

function getPaymentStatusLabel(paymentStatus) {
  if (paymentStatus === 'paid') {
    return 'Plătită'
  }

  if (paymentStatus === 'failed') {
    return 'Eșuată'
  }

  return 'În așteptare'
}

function getOrderAddress(order, type = 'shipping') {
  return (order.addresses || []).find((address) => address.type === type) || null
}

function formatAddressLines(address) {
  if (!address) {
    return []
  }

  return [
    `${address.firstName || ''} ${address.lastName || ''}`.trim(),
    address.company,
    address.streetAddress,
    address.addressExtra,
    [address.city, address.county, address.postalCode].filter(Boolean).join(', '),
    address.country,
    address.phone ? `Telefon: ${address.phone}` : '',
  ].filter(Boolean)
}

function getAdoptionDetailsLines(snapshot) {
  const details = snapshot?.adoptionDetails

  if (!details) {
    return []
  }

  const purpose = details.treePurpose === 'other'
    ? details.treePurposeOther
    : details.treePurpose

  return [
    details.certificateName ? `Nume certificat: ${details.certificateName}` : '',
    details.treeName ? `Numele pomului: ${details.treeName}` : '',
    purpose ? `Scop adopție: ${purpose}` : '',
    details.treeMessage ? `Mesaj pentru pom: ${details.treeMessage}` : '',
  ].filter(Boolean)
}

function renderInfoRows(rows) {
  return rows
    .map((row) => `
      <tr>
        <td style="padding: 10px 0; color:#7a5c46; font-family: Arial, sans-serif; font-size: 13px; font-weight:700; text-transform:uppercase; letter-spacing:.04em;">
          ${row.label}
        </td>
        <td align="right" style="padding: 10px 0; color:#244235; font-family: Arial, sans-serif; font-size: 14px; font-weight:700;">
          ${row.value}
        </td>
      </tr>
    `)
    .join('')
}

function renderOrderItemsHtml(order) {
  return (order.items || [])
    .map((item) => {
      const snapshot = item.productSnapshot || {}
      const details = getAdoptionDetailsLines(snapshot)
      const detailsHtml = details.length
        ? `<ul style="margin: 10px 0 0; padding-left: 18px; color:#7a5c46; font-family: Arial, sans-serif; font-size: 13px; line-height:1.55;">
            ${details.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}
          </ul>`
        : ''

      return `
        <tr>
          <td style="padding: 16px 0; border-top:1px solid #e6dac9;">
            <div style="font-family: Arial, sans-serif; color:#244235; font-size: 15px; font-weight:700;">
              ${escapeHtml(item.productName)}
            </div>
            <div style="margin-top: 6px; font-family: Arial, sans-serif; color:#7a5c46; font-size: 13px;">
              Cantitate: ${item.quantity} × ${formatMoney(item.unitPrice, order.currency)}
            </div>
            ${detailsHtml}
          </td>
          <td align="right" style="padding: 16px 0; border-top:1px solid #e6dac9; font-family: Arial, sans-serif; color:#244235; font-size: 14px; font-weight:700; white-space:nowrap;">
            ${formatMoney(item.lineTotal, order.currency)}
          </td>
        </tr>
      `
    })
    .join('')
}

function renderOrderItemsText(order) {
  return (order.items || []).flatMap((item) => {
    const lines = [
      `- ${item.productName}`,
      `  Cantitate: ${item.quantity} x ${formatMoney(item.unitPrice, order.currency)}`,
      `  Subtotal produs: ${formatMoney(item.lineTotal, order.currency)}`,
    ]
    const details = getAdoptionDetailsLines(item.productSnapshot || {})

    for (const detail of details) {
      lines.push(`  ${detail}`)
    }

    return lines
  })
}

function renderTransactionalEmail({
  eyebrow,
  title,
  greeting,
  intro,
  contentHtml,
  buttonText,
  actionUrl,
  note,
}) {
  const privacyUrl = `${getSiteBaseUrl()}/politica-de-confidentialitate`
  const buttonHtml = buttonText && actionUrl
    ? `
      <div style="padding: 18px 0 22px;">
        <a href="${actionUrl}" style="display:inline-block; background:#8d0b1f; color:#ffffff; padding: 13px 22px; border-radius: 6px; text-decoration:none; font-family: Arial, sans-serif; font-size: 13px; letter-spacing:.04em; text-transform:uppercase; font-weight: 700;">
          ${buttonText}
        </a>
      </div>
    `
    : ''

  return `
    <div style="margin:0; padding:0; background:#ffffff;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#ffffff; padding: 24px 12px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 680px; background:#ffffff; border:1px solid #e6dac9;">
              <tr>
                <td style="padding: 30px 32px 22px; border-bottom:4px solid #8d0b1f;">
                  <div style="font-family: Georgia, 'Times New Roman', serif; font-size: 25px; font-weight:700; color:#244235;">
                    Fructul Bucovinei
                  </div>
                  <div style="margin-top: 12px; font-family: Arial, sans-serif; font-size: 11px; letter-spacing:.14em; text-transform:uppercase; font-weight:700; color:#7a5c46;">
                    ${eyebrow}
                  </div>
                  <h1 style="margin: 12px 0 0; font-family: Georgia, 'Times New Roman', serif; color:#244235; font-size: 34px; line-height:1.08;">
                    ${title}
                  </h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 28px 32px 32px;">
                  <p style="margin: 0 0 14px; color:#244235; font-family: Arial, sans-serif; font-size:16px; line-height:1.65;">
                    ${greeting}
                  </p>
                  <p style="margin: 0 0 22px; color:#244235; font-family: Arial, sans-serif; font-size:16px; line-height:1.65;">
                    ${intro}
                  </p>
                  ${contentHtml}
                  ${buttonHtml}
                  ${actionUrl ? `
                    <p style="margin: 0 0 10px; color:#7a5c46; font-family: Arial, sans-serif; font-size: 13px; line-height:1.55;">
                      Dacă butonul nu funcționează, copiază linkul de mai jos în browser:
                    </p>
                    <p style="margin: 0; word-break: break-all; color:#244235; font-family: Arial, sans-serif; font-size: 13px; line-height:1.55;">
                      ${actionUrl}
                    </p>
                  ` : ''}
                  <div style="margin-top: 28px; padding-top: 18px; border-top:1px solid #e6dac9;">
                    <p style="margin:0 0 12px; color:#7a5c46; font-family: Arial, sans-serif; font-size: 13px; line-height:1.55;">
                      ${note}
                    </p>
                    <p style="margin:0 0 10px; color:#7a5c46; font-family: Arial, sans-serif; font-size: 12px; line-height:1.55;">
                      Acesta este un mesaj tranzacțional/administrativ, transmis pentru gestionarea comenzii sau a contului tău. Nu este comunicare comercială.
                    </p>
                    <p style="margin:0 0 10px; color:#7a5c46; font-family: Arial, sans-serif; font-size: 12px; line-height:1.55;">
                      Operator date: FRUCTUL BUCOVINEI SRL, Sat Rădășeni, Str. Părului 1, județul Suceava, CUI 38785393.
                    </p>
                    <p style="margin:0 0 10px; color:#7a5c46; font-family: Arial, sans-serif; font-size: 12px; line-height:1.55;">
                      Prelucrăm datele tale strict pentru gestionarea contului, procesarea comenzii, livrare, facturare, suport și obligații legale. Ai drept de acces, rectificare, ștergere, restricționare, portabilitate, opoziție și dreptul de a depune o plângere la autoritatea de supraveghere, în condițiile GDPR.
                    </p>
                    <p style="margin:0; color:#7a5c46; font-family: Arial, sans-serif; font-size: 12px; line-height:1.55;">
                      Detalii: <a href="${privacyUrl}" style="color:#8d0b1f; text-decoration:underline;">Politica de confidențialitate</a>. Contact: contact@fructulbucovinei.ro.
                    </p>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `
}

async function sendEmailVerificationMessage({ email, firstName, token }) {
  const siteBaseUrl = getSiteBaseUrl()
  const verificationUrl = `${siteBaseUrl}/confirmare-email?token=${encodeURIComponent(token)}`
  const from = process.env.SMTP_FROM || process.env.SMTP_USER
  const brandName = 'Fructul Bucovinei'
  const note = 'Dacă nu ai creat tu acest cont, poți ignora acest mesaj.'

  await getMailTransporter().sendMail({
    from,
    to: email,
    subject: 'Confirmă adresa de email - Fructul Bucovinei',
    text: [
      `Bună, ${firstName || ''}`.trim() + ',',
      '',
      'Îți mulțumim că ți-ai creat cont la Fructul Bucovinei.',
      'Pentru a activa contul, confirmă adresa de email accesând linkul de mai jos:',
      verificationUrl,
      '',
      `Linkul este valabil ${EMAIL_VERIFICATION_TTL_MINUTES} de minute.`,
      '',
      ...getTransactionalEmailFooterText(note),
      '',
      brandName,
    ].join('\n'),
    html: renderTransactionalEmail({
      eyebrow: 'Confirmare cont',
      title: 'Confirmă adresa de email',
      greeting: `Bună, ${escapeHtml(firstName || '')},`,
      intro: `Îți mulțumim că ți-ai creat cont la <strong>Fructul Bucovinei</strong>. Pentru a activa contul, apasă pe butonul de mai jos. Linkul este valabil ${EMAIL_VERIFICATION_TTL_MINUTES} de minute.`,
      contentHtml: '',
      buttonText: 'Confirmă emailul',
      actionUrl: verificationUrl,
      note,
    }),
  })
}

async function sendPasswordResetMessage({ email, firstName, token }) {
  const siteBaseUrl = getSiteBaseUrl()
  const resetUrl = `${siteBaseUrl}/resetare-parola?token=${encodeURIComponent(token)}`
  const from = process.env.SMTP_FROM || process.env.SMTP_USER
  const brandName = 'Fructul Bucovinei'
  const note = 'Dacă nu ai cerut tu resetarea parolei, poți ignora acest mesaj.'

  await getMailTransporter().sendMail({
    from,
    to: email,
    subject: 'Resetare parolă - Fructul Bucovinei',
    text: [
      `Bună, ${firstName || ''}`.trim() + ',',
      '',
      'Am primit o solicitare pentru resetarea parolei contului tău Fructul Bucovinei.',
      'Pentru a seta o parolă nouă, accesează linkul de mai jos:',
      resetUrl,
      '',
      `Linkul este valabil ${PASSWORD_RESET_TTL_MINUTES} de minute.`,
      '',
      ...getTransactionalEmailFooterText(note),
      '',
      brandName,
    ].join('\n'),
    html: renderTransactionalEmail({
      eyebrow: 'Securitatea contului',
      title: 'Resetează parola',
      greeting: `Bună, ${escapeHtml(firstName || '')},`,
      intro: `Am primit o solicitare pentru resetarea parolei contului tău <strong>Fructul Bucovinei</strong>. Pentru a seta o parolă nouă, apasă pe butonul de mai jos. Linkul este valabil ${PASSWORD_RESET_TTL_MINUTES} de minute.`,
      contentHtml: '',
      buttonText: 'Resetează parola',
      actionUrl: resetUrl,
      note,
    }),
  })
}

async function sendOrderConfirmationMessage(order) {
  if (!order?.customerEmail) {
    return
  }

  const shippingAddress = getOrderAddress(order, 'shipping')
  const shippingLines = formatAddressLines(shippingAddress)
  const note = 'Primești acest email deoarece ai plasat o comandă pe site-ul Fructul Bucovinei.'
  const contentHtml = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 22px;">
      ${renderInfoRows([
        { label: 'Număr comandă', value: `#${escapeHtml(order.orderNumber)}` },
        { label: 'Metodă de plată', value: escapeHtml(getPaymentMethodLabel(order.paymentMethod)) },
        { label: 'Status plată', value: escapeHtml(getPaymentStatusLabel(order.paymentStatus)) },
      ])}
    </table>

    <h2 style="margin: 26px 0 8px; font-family: Georgia, 'Times New Roman', serif; color:#244235; font-size: 24px;">
      Produse comandate
    </h2>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      ${renderOrderItemsHtml(order)}
    </table>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 18px 0 24px; border-top:2px solid #244235;">
      ${renderInfoRows([
        { label: 'Subtotal', value: formatMoney(order.subtotalAmount, order.currency) },
        ...(Number(order.discountAmount || 0) > 0
          ? [{ label: `Reducere ${escapeHtml(order.discountCode || '')}`, value: `-${formatMoney(order.discountAmount, order.currency)}` }]
          : []),
        { label: 'Livrare', value: formatMoney(order.shippingAmount, order.currency) },
        { label: 'Total', value: formatMoney(order.totalAmount, order.currency) },
      ])}
    </table>

    <h2 style="margin: 26px 0 10px; font-family: Georgia, 'Times New Roman', serif; color:#244235; font-size: 24px;">
      Adresa de livrare
    </h2>
    <p style="margin:0; color:#244235; font-family: Arial, sans-serif; font-size: 15px; line-height:1.7;">
      ${shippingLines.map(escapeHtml).join('<br>')}
    </p>
  `

  await getMailTransporter().sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: order.customerEmail,
    subject: `Am primit comanda ta #${order.orderNumber} - Fructul Bucovinei`,
    text: [
      'Bună,',
      '',
      `Îți mulțumim pentru comandă. Am primit comanda ta #${order.orderNumber}.`,
      '',
      `Metodă de plată: ${getPaymentMethodLabel(order.paymentMethod)}`,
      `Total: ${formatMoney(order.totalAmount, order.currency)}`,
      '',
      'Produse comandate:',
      ...renderOrderItemsText(order),
      '',
      'Adresa de livrare:',
      ...shippingLines,
      '',
      ...getTransactionalEmailFooterText(note),
      '',
      'Fructul Bucovinei',
    ].join('\n'),
    html: renderTransactionalEmail({
      eyebrow: 'Confirmare comandă',
      title: `Mulțumim pentru comandă`,
      greeting: 'Bună,',
      intro: `Am primit comanda ta <strong>#${escapeHtml(order.orderNumber)}</strong>. Mai jos găsești sumarul comenzii și detaliile de livrare.`,
      contentHtml,
      note,
    }),
  })
}

async function sendOrderShippedMessage(order) {
  if (!order?.customerEmail || !order.awb) {
    return
  }

  const shippingAddress = getOrderAddress(order, 'shipping')
  const shippingLines = formatAddressLines(shippingAddress)
  const note = 'Primești acest email deoarece statusul comenzii tale a fost actualizat.'
  const contentHtml = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 22px;">
      ${renderInfoRows([
        { label: 'Număr comandă', value: `#${escapeHtml(order.orderNumber)}` },
        { label: 'Curier', value: 'FAN Courier' },
        {
          label: 'AWB',
          value: `<a href="${FAN_COURIER_TRACKING_URL}" style="color:#8d0b1f; text-decoration:underline;">${escapeHtml(order.awb)}</a>`,
        },
        { label: 'Status', value: 'Expediată' },
      ])}
    </table>

    <h2 style="margin: 26px 0 8px; font-family: Georgia, 'Times New Roman', serif; color:#244235; font-size: 24px;">
      Produse expediate
    </h2>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      ${renderOrderItemsHtml(order)}
    </table>

    <h2 style="margin: 26px 0 10px; font-family: Georgia, 'Times New Roman', serif; color:#244235; font-size: 24px;">
      Adresa de livrare
    </h2>
    <p style="margin:0; color:#244235; font-family: Arial, sans-serif; font-size: 15px; line-height:1.7;">
      ${shippingLines.map(escapeHtml).join('<br>')}
    </p>
  `

  await getMailTransporter().sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: order.customerEmail,
    subject: `Comanda #${order.orderNumber} a fost expediată - Fructul Bucovinei`,
    text: [
      'Bună,',
      '',
      `Comanda ta #${order.orderNumber} a fost expediată.`,
      'Curier: FAN Courier',
      `AWB: ${order.awb}`,
      `Verifică livrarea: ${FAN_COURIER_TRACKING_URL}`,
      '',
      'Produse expediate:',
      ...renderOrderItemsText(order),
      '',
      'Adresa de livrare:',
      ...shippingLines,
      '',
      ...getTransactionalEmailFooterText(note),
      '',
      'Fructul Bucovinei',
    ].join('\n'),
    html: renderTransactionalEmail({
      eyebrow: 'Comandă expediată',
      title: 'Comanda ta a fost expediată',
      greeting: 'Bună,',
      intro: `Comanda <strong>#${escapeHtml(order.orderNumber)}</strong> a fost predată către curierul <strong>FAN Courier</strong>. AWB-ul comenzii este <strong>${escapeHtml(order.awb)}</strong>.`,
      contentHtml,
      note,
    }),
  })
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase()
}

function normalizeName(name) {
  return String(name || '').trim().replace(/\s+/g, ' ')
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function toBase64Url(value) {
  return Buffer.from(value).toString('base64url')
}

function fromBase64Url(value) {
  return Buffer.from(value, 'base64url').toString('utf8')
}

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const derivedKey = await new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (error, result) => {
      if (error) {
        reject(error)
        return
      }

      resolve(result)
    })
  })

  return `${salt}:${derivedKey.toString('hex')}`
}

async function verifyPassword(password, storedHash) {
  const [salt, expectedHash] = String(storedHash || '').split(':')

  if (!salt || !expectedHash) {
    return false
  }

  const derivedKey = await new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (error, result) => {
      if (error) {
        reject(error)
        return
      }

      resolve(result)
    })
  })

  const expectedBuffer = Buffer.from(expectedHash, 'hex')

  if (derivedKey.length !== expectedBuffer.length) {
    return false
  }

  return crypto.timingSafeEqual(derivedKey, expectedBuffer)
}

function createSessionToken(payload) {
  const fullPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  }
  const serializedPayload = toBase64Url(JSON.stringify(fullPayload))
  const signature = crypto
    .createHmac('sha256', requiredEnv('AUTH_SECRET'))
    .update(serializedPayload)
    .digest('base64url')

  return `${serializedPayload}.${signature}`
}

function createPaymentReturnToken(orderNumber) {
  const payload = toBase64Url(JSON.stringify({
    orderNumber,
    exp: Math.floor(Date.now() / 1000) + PAYMENT_RETURN_TTL_SECONDS,
  }))
  const signature = crypto
    .createHmac('sha256', requiredEnv('AUTH_SECRET'))
    .update(`payment-return:${payload}`)
    .digest('base64url')

  return `${payload}.${signature}`
}

function isValidPaymentReturnToken(orderNumber, token) {
  const [payload, signature] = String(token || '').split('.')

  if (!payload || !signature) {
    return false
  }

  const expectedSignature = crypto
    .createHmac('sha256', requiredEnv('AUTH_SECRET'))
    .update(`payment-return:${payload}`)
    .digest('base64url')

  if (
    signature.length !== expectedSignature.length ||
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
  ) {
    return false
  }

  try {
    const tokenPayload = JSON.parse(fromBase64Url(payload))

    return tokenPayload.orderNumber === orderNumber && tokenPayload.exp > Math.floor(Date.now() / 1000)
  } catch {
    return false
  }
}

function createTwoFactorChallengeToken(payload) {
  const fullPayload = {
    ...payload,
    purpose: 'two-factor-login',
    exp: Math.floor(Date.now() / 1000) + TWO_FACTOR_CHALLENGE_TTL_SECONDS,
  }
  const serializedPayload = toBase64Url(JSON.stringify(fullPayload))
  const signature = crypto
    .createHmac('sha256', requiredEnv('AUTH_SECRET'))
    .update(serializedPayload)
    .digest('base64url')

  return `${serializedPayload}.${signature}`
}

function verifySessionToken(token) {
  const [serializedPayload, signature] = String(token || '').split('.')

  if (!serializedPayload || !signature) {
    return null
  }

  const expectedSignature = crypto
    .createHmac('sha256', requiredEnv('AUTH_SECRET'))
    .update(serializedPayload)
    .digest('base64url')

  if (
    signature.length !== expectedSignature.length ||
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
  ) {
    return null
  }

  try {
    const payload = JSON.parse(fromBase64Url(serializedPayload))

    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }

    return payload
  } catch {
    return null
  }
}

function verifyTwoFactorChallengeToken(token) {
  const payload = verifySessionToken(token)

  if (!payload || payload.purpose !== 'two-factor-login') {
    return null
  }

  return payload
}

function parseCookies(cookieHeader = '') {
  return cookieHeader.split(';').reduce((cookies, part) => {
    const [name, ...rest] = part.trim().split('=')

    if (!name || rest.length === 0) {
      return cookies
    }

    cookies[name] = rest.join('=')
    return cookies
  }, {})
}

async function getSessionUser(request) {
  const cookies = parseCookies(request.headers.cookie || '')
  const token = cookies[AUTH_COOKIE_NAME]

  if (!token) {
    return null
  }

  const session = verifySessionToken(token)

  if (!session?.sub) {
    return null
  }

  const db = getDbClient()
  const [rows] = await db.execute(
    `SELECT id, first_name, last_name, email, password_hash, role, two_factor_enabled
     FROM users
     WHERE id = ?
     LIMIT 1`,
    [session.sub]
  )

  return rows[0] ?? null
}

function buildUserResponse(user) {
  return {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    role: user.role,
    twoFactorEnabled: Boolean(Number(user.two_factor_enabled || 0)),
  }
}

async function requireAdminUser(request, response) {
  const currentUser = await getSessionUser(request)

  if (!currentUser) {
    sendError(response, request, 401, 'Trebuie să fii autentificat.')
    return null
  }

  if (currentUser.role !== 'admin') {
    sendError(response, request, 403, 'Nu ai acces la această zonă.')
    return null
  }

  return currentUser
}

function buildProductResponse(product) {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    image: product.image,
    price: Number(product.price),
    stockQuantity: Number(product.stock_quantity),
    status: product.status,
    createdAt: product.created_at,
    updatedAt: product.updated_at,
  }
}

function parseAmount(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  const normalizedValue = String(value || '')
    .replace(/[^\d,.-]/g, '')
    .replace('.', '')
    .replace(',', '.')

  return Number.parseFloat(normalizedValue) || 0
}

function normalizeOrderNumber(value) {
  return String(value || '').trim().replace(/^#/, '').toUpperCase()
}

const PROMO_CODES = {}

function getPromoDiscountPercent(code) {
  return PROMO_CODES[String(code || '').trim().toUpperCase()] || 0
}

function normalizeProductSlug(slug) {
  return String(slug || '').trim().replace(/-\d{8,}$/, '')
}

function getRequiredString(value) {
  return String(value || '').trim()
}

function isValidPhoneNumber(value) {
  const phone = getRequiredString(value)
  const digitCount = phone.replace(/\D/g, '').length

  return digitCount >= 7 && digitCount <= 15 && /^\+?[0-9\s().-]+$/.test(phone)
}

function isValidPostalCode(value) {
  return /^[0-9]{4,10}$/.test(getRequiredString(value))
}

function normalizeAddress(address = {}) {
  return {
    firstName: normalizeName(address.firstName),
    lastName: normalizeName(address.lastName),
    company: normalizeName(address.company),
    country: getRequiredString(address.country) || 'România',
    phone: getRequiredString(address.phone),
    streetAddress: getRequiredString(address.streetAddress),
    addressExtra: getRequiredString(address.addressExtra),
    county: getRequiredString(address.county),
    city: getRequiredString(address.city),
    postalCode: getRequiredString(address.postalCode),
  }
}

function validateAddress(address) {
  return Boolean(
    address.firstName &&
    address.lastName &&
    address.country &&
    isValidPhoneNumber(address.phone) &&
    address.streetAddress &&
    address.county &&
    address.city &&
    isValidPostalCode(address.postalCode)
  )
}

function buildOrderNumber(orderId) {
  return `FB${String(orderId).padStart(6, '0')}`
}

function mapOrderStatus(status) {
  const labels = {
    pending: 'Comandă primită',
    confirmed: 'Confirmată',
    processing: 'În procesare',
    shipped: 'Expediată',
    completed: 'Finalizată',
    cancelled: 'Anulată',
    refunded: 'Rambursată',
  }

  return labels[status] || status
}

function parseSnapshot(snapshot) {
  if (!snapshot) {
    return null
  }

  if (typeof snapshot === 'object') {
    return snapshot
  }

  try {
    return JSON.parse(snapshot)
  } catch {
    return null
  }
}

function buildOrderResponse(order, items = [], addresses = []) {
  return {
    id: order.id,
    orderNumber: order.order_number,
    userId: order.user_id,
    customerEmail: order.customer_email,
    status: order.status,
    statusLabel: mapOrderStatus(order.status),
    awb: order.awb || null,
    paymentMethod: order.payment_method,
    paymentStatus: order.payment_status,
    currency: order.currency,
    subtotalAmount: Number(order.subtotal_amount),
    discountCode: order.discount_code,
    discountPercent: Number(order.discount_percent),
    discountAmount: Number(order.discount_amount),
    shippingAmount: Number(order.shipping_amount),
    totalAmount: Number(order.total_amount),
    customerNote: order.customer_note,
    createdAt: order.created_at,
    updatedAt: order.updated_at,
    items: items.map((item) => ({
      id: item.id,
      productId: item.product_id,
      productSlug: item.product_slug,
      productName: item.product_name,
      productImage: item.product_image,
      unitPrice: Number(item.unit_price),
      quantity: item.quantity,
      lineTotal: Number(item.line_total),
      productSnapshot: parseSnapshot(item.product_snapshot),
    })),
    addresses: addresses.map((address) => ({
      id: address.id,
      type: address.address_type,
      firstName: address.first_name,
      lastName: address.last_name,
      company: address.company,
      country: address.country,
      phone: address.phone,
      streetAddress: address.street_address,
      addressExtra: address.address_extra,
      county: address.county,
      city: address.city,
      postalCode: address.postal_code,
    })),
  }
}

function parseJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = ''

    request.on('data', (chunk) => {
      body += chunk

      if (body.length > 1024 * 1024) {
        request.destroy()
        reject(new Error('Body too large.'))
      }
    })

    request.on('end', () => {
      if (!body) {
        resolve({})
        return
      }

      try {
        resolve(JSON.parse(body))
      } catch {
        reject(new Error('Invalid JSON.'))
      }
    })

    request.on('error', reject)
  })
}

function parseFormBody(request) {
  return new Promise((resolve, reject) => {
    let body = ''

    request.on('data', (chunk) => {
      body += chunk

      if (body.length > 2 * 1024 * 1024) {
        request.destroy()
        reject(new Error('Body too large.'))
      }
    })

    request.on('end', () => {
      const params = new URLSearchParams(body)
      resolve(Object.fromEntries(params.entries()))
    })

    request.on('error', reject)
  })
}

function getCorsHeaders(request) {
  const origin = request.headers.origin
  const allowedOrigins = [
    ...(process.env.FRONTEND_ORIGIN || '').split(','),
    ...(process.env.FRONTEND_ORIGINS || '').split(','),
  ]
    .map((value) => value.trim())
    .filter(Boolean)
  const headers = {
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Credentials': 'true',
    'Vary': 'Origin',
  }

  if (origin && allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin
  } else if (allowedOrigins.length === 0 && origin) {
    headers['Access-Control-Allow-Origin'] = origin
  }

  return headers
}

function createCookie(token) {
  const parts = [
    `${AUTH_COOKIE_NAME}=${token}`,
    'HttpOnly',
    'Path=/',
    `Max-Age=${SESSION_TTL_SECONDS}`,
    'SameSite=Lax',
  ]

  if (process.env.NODE_ENV === 'production') {
    parts.push('Secure')
  }

  if (process.env.COOKIE_DOMAIN) {
    parts.push(`Domain=${process.env.COOKIE_DOMAIN}`)
  }

  return parts.join('; ')
}

function clearCookie() {
  const parts = [
    `${AUTH_COOKIE_NAME}=`,
    'HttpOnly',
    'Path=/',
    'Max-Age=0',
    'SameSite=Lax',
  ]

  if (process.env.NODE_ENV === 'production') {
    parts.push('Secure')
  }

  if (process.env.COOKIE_DOMAIN) {
    parts.push(`Domain=${process.env.COOKIE_DOMAIN}`)
  }

  return parts.join('; ')
}

function sendJson(response, request, status, payload, extraHeaders = {}) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    ...getCorsHeaders(request),
    ...extraHeaders,
  })
  response.end(JSON.stringify(payload))
}

function sendError(response, request, status, message) {
  sendJson(response, request, status, { error: message })
}

function getRoutePath(request) {
  const url = new URL(request.url, 'http://localhost')
  const pathname = url.pathname.replace(/\/$/, '')

  if (pathname.startsWith('/api/')) {
    return pathname
  }

  if (pathname.startsWith('/auth/')) {
    return `/api${pathname}`
  }

  return pathname || '/'
}

async function handleRegister(request, response) {
  let body

  try {
    body = await parseJsonBody(request)
  } catch {
    sendError(response, request, 400, 'Cerere invalidă.')
    return
  }

  const firstName = normalizeName(body.firstName)
  const lastName = normalizeName(body.lastName)
  const email = normalizeEmail(body.email)
  const emailConfirm = normalizeEmail(body.emailConfirm)
  const password = body.password || ''
  const passwordConfirm = body.passwordConfirm || ''

  if (!firstName || !lastName || !email || !emailConfirm || !password || !passwordConfirm) {
    sendError(response, request, 400, 'Toate câmpurile sunt obligatorii.')
    return
  }

  if (!body.termsAccepted) {
    sendError(response, request, 400, 'Trebuie să accepți termenii și condițiile și politica de confidențialitate.')
    return
  }

  if (email !== emailConfirm) {
    sendError(response, request, 400, 'Adresele de email nu coincid.')
    return
  }

  if (password !== passwordConfirm) {
    sendError(response, request, 400, 'Parolele nu coincid.')
    return
  }

  if (password.length < 8) {
    sendError(response, request, 400, 'Parola trebuie să aibă cel puțin 8 caractere.')
    return
  }

  const db = getDbClient()
  await deleteExpiredUnverifiedUsers(db)

  const [existingUsers] = await db.execute(
    'SELECT id, email_verified_at FROM users WHERE email = ? LIMIT 1',
    [email]
  )
  const existingUser = existingUsers[0]

  if (existingUser?.email_verified_at) {
    sendError(response, request, 409, 'Există deja un cont cu această adresă de email.')
    return
  }

  const passwordHash = await hashPassword(password)
  const verificationToken = createEmailVerificationToken()
  const verificationTokenHash = hashVerificationToken(verificationToken)
  let pendingUserId = existingUser?.id || null

  if (pendingUserId) {
    await db.execute(
      `UPDATE users
       SET first_name = ?,
           last_name = ?,
           password_hash = ?,
           terms_accepted_at = NOW(),
           email_verification_token_hash = ?,
           email_verification_expires_at = DATE_ADD(NOW(), INTERVAL ? MINUTE),
           email_verification_sent_at = NOW(),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        firstName,
        lastName,
        passwordHash,
        verificationTokenHash,
        EMAIL_VERIFICATION_TTL_MINUTES,
        pendingUserId,
      ]
    )
  } else {
    const [result] = await db.execute(
      `INSERT INTO users (
        first_name,
        last_name,
        email,
        password_hash,
        terms_accepted_at,
        email_verification_token_hash,
        email_verification_expires_at,
        email_verification_sent_at
      ) VALUES (?, ?, ?, ?, NOW(), ?, DATE_ADD(NOW(), INTERVAL ? MINUTE), NOW())`,
      [
        firstName,
        lastName,
        email,
        passwordHash,
        verificationTokenHash,
        EMAIL_VERIFICATION_TTL_MINUTES,
      ]
    )
    pendingUserId = result.insertId
  }

  try {
    await sendEmailVerificationMessage({
      email,
      firstName,
      token: verificationToken,
    })
  } catch (error) {
    console.error(error)

    if (pendingUserId) {
      await db.execute(
        'DELETE FROM users WHERE id = ? AND email_verified_at IS NULL',
        [pendingUserId]
      )
    }

    sendError(response, request, 500, 'Nu am putut trimite emailul de confirmare. Te rugăm să încerci din nou.')
    return
  }

  sendJson(response, request, 201, {
    message: `Ți-am trimis un email de confirmare. Linkul este valabil ${EMAIL_VERIFICATION_TTL_MINUTES} de minute.`,
  })
}

async function handleVerifyEmail(request, response) {
  let body

  try {
    body = await parseJsonBody(request)
  } catch {
    sendError(response, request, 400, 'Cerere invalidă.')
    return
  }

  const token = String(body.token || '').trim()

  if (!token) {
    sendError(response, request, 400, 'Tokenul de confirmare lipsește.')
    return
  }

  const db = getDbClient()
  await deleteExpiredUnverifiedUsers(db)

  const tokenHash = hashVerificationToken(token)
  const [rows] = await db.execute(
    `SELECT id, email_verified_at, email_verification_expires_at
     FROM users
     WHERE email_verification_token_hash = ?
     LIMIT 1`,
    [tokenHash]
  )
  const user = rows[0]

  if (!user) {
    sendError(response, request, 400, 'Linkul de confirmare este invalid sau a expirat.')
    return
  }

  if (user.email_verified_at) {
    sendJson(response, request, 200, {
      message: 'Adresa de email este deja confirmată. Te poți autentifica.',
    })
    return
  }

  await db.execute(
    `UPDATE users
     SET email_verified_at = NOW(),
         email_verification_token_hash = NULL,
         email_verification_expires_at = NULL,
         email_verification_sent_at = NULL,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [user.id]
  )

  sendJson(response, request, 200, {
    message: 'Adresa de email a fost confirmată. Te poți autentifica.',
  })
}

async function handleLogin(request, response) {
  let body

  try {
    body = await parseJsonBody(request)
  } catch {
    sendError(response, request, 400, 'Cerere invalidă.')
    return
  }

  const email = normalizeEmail(body.email)
  const password = body.password || ''

  if (!email || !password) {
    sendError(response, request, 400, 'Emailul și parola sunt obligatorii.')
    return
  }

  const db = getDbClient()
  await deleteExpiredUnverifiedUsers(db)

  const [rows] = await db.execute(
    `SELECT id, first_name, last_name, email, password_hash, role, two_factor_enabled, two_factor_secret, email_verified_at
     FROM users
     WHERE email = ?
     LIMIT 1`,
    [email]
  )
  const user = rows[0]

  if (!user) {
    sendError(response, request, 401, 'Datele de autentificare sunt incorecte.')
    return
  }

  const isPasswordValid = await verifyPassword(password, user.password_hash)

  if (!isPasswordValid) {
    sendError(response, request, 401, 'Datele de autentificare sunt incorecte.')
    return
  }

  if (!user.email_verified_at) {
    sendError(response, request, 403, 'Te rugăm să confirmi adresa de email înainte de autentificare.')
    return
  }

  if (Number(user.two_factor_enabled || 0) === 1) {
    const challengeToken = createTwoFactorChallengeToken({
      sub: String(user.id),
      email: user.email,
    })

    sendJson(response, request, 200, {
      requiresTwoFactor: true,
      challengeToken,
      message: 'Introdu codul din aplicația de autentificare.',
    })
    return
  }

  await db.execute('UPDATE users SET last_login_at = NOW() WHERE id = ?', [user.id])

  const responseUser = {
    ...buildUserResponse(user),
  }
  const token = createSessionToken({
    sub: String(user.id),
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
  })

  sendJson(response, request, 200, { user: responseUser }, {
    'Set-Cookie': createCookie(token),
  })
}

async function handleForgotPassword(request, response) {
  let body

  try {
    body = await parseJsonBody(request)
  } catch {
    sendError(response, request, 400, 'Cerere invalidă.')
    return
  }

  const email = normalizeEmail(body.email)
  const genericMessage = 'Dacă adresa de email este găsită la noi în sistem, vei primi un link de resetare pe email.'

  if (!email) {
    sendError(response, request, 400, 'Adresa de email este obligatorie.')
    return
  }

  const db = getDbClient()
  await clearExpiredPasswordResetTokens(db)

  const [rows] = await db.execute(
    `SELECT id, first_name, email, email_verified_at
     FROM users
     WHERE email = ?
     LIMIT 1`,
    [email]
  )
  const user = rows[0]

  if (!user || !user.email_verified_at) {
    sendJson(response, request, 200, { message: genericMessage })
    return
  }

  const resetToken = createPasswordResetToken()
  const resetTokenHash = hashVerificationToken(resetToken)

  await db.execute(
    `UPDATE users
     SET password_reset_token_hash = ?,
         password_reset_expires_at = DATE_ADD(NOW(), INTERVAL ? MINUTE),
         password_reset_sent_at = NOW(),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [resetTokenHash, PASSWORD_RESET_TTL_MINUTES, user.id]
  )

  try {
    await sendPasswordResetMessage({
      email: user.email,
      firstName: user.first_name,
      token: resetToken,
    })
  } catch (error) {
    console.error(error)
    sendError(response, request, 500, 'Nu am putut trimite emailul de resetare. Te rugăm să încerci din nou.')
    return
  }

  sendJson(response, request, 200, { message: genericMessage })
}

async function handleResetPassword(request, response) {
  let body

  try {
    body = await parseJsonBody(request)
  } catch {
    sendError(response, request, 400, 'Cerere invalidă.')
    return
  }

  const token = String(body.token || '').trim()
  const password = body.password || ''
  const passwordConfirm = body.passwordConfirm || ''

  if (!token || !password || !passwordConfirm) {
    sendError(response, request, 400, 'Toate câmpurile sunt obligatorii.')
    return
  }

  if (password !== passwordConfirm) {
    sendError(response, request, 400, 'Parolele nu coincid.')
    return
  }

  if (password.length < 8) {
    sendError(response, request, 400, 'Parola trebuie să aibă cel puțin 8 caractere.')
    return
  }

  const db = getDbClient()
  await clearExpiredPasswordResetTokens(db)

  const tokenHash = hashVerificationToken(token)
  const [rows] = await db.execute(
    `SELECT id, password_hash
     FROM users
     WHERE password_reset_token_hash = ?
       AND password_reset_expires_at IS NOT NULL
       AND password_reset_expires_at >= NOW()
     LIMIT 1`,
    [tokenHash]
  )
  const user = rows[0]

  if (!user) {
    sendError(response, request, 400, 'Linkul de resetare este invalid sau a expirat.')
    return
  }

  const isSamePassword = await verifyPassword(password, user.password_hash)

  if (isSamePassword) {
    sendError(response, request, 400, 'Parola nouă nu poate fi aceeași cu parola actuală.')
    return
  }

  const passwordHash = await hashPassword(password)

  await db.execute(
    `UPDATE users
     SET password_hash = ?,
         password_reset_token_hash = NULL,
         password_reset_expires_at = NULL,
         password_reset_sent_at = NULL,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [passwordHash, user.id]
  )

  sendJson(response, request, 200, {
    message: 'Parola a fost resetată cu succes. Te poți autentifica.',
  })
}

async function handleTwoFactorLogin(request, response) {
  let body

  try {
    body = await parseJsonBody(request)
  } catch {
    sendError(response, request, 400, 'Cerere invalidă.')
    return
  }

  const challenge = verifyTwoFactorChallengeToken(body.challengeToken)
  const code = String(body.code || '').replace(/\D/g, '')

  if (!challenge?.sub || !code) {
    sendError(response, request, 400, 'Codul de autentificare este obligatoriu.')
    return
  }

  const db = getDbClient()
  const [rows] = await db.execute(
    `SELECT id, first_name, last_name, email, password_hash, role, two_factor_enabled, two_factor_secret
     FROM users
     WHERE id = ?
     LIMIT 1`,
    [challenge.sub]
  )
  const user = rows[0]

  if (!user || Number(user.two_factor_enabled || 0) !== 1 || !user.two_factor_secret) {
    sendError(response, request, 401, 'Autentificarea în 2 pași nu este disponibilă pentru acest cont.')
    return
  }

  const isCodeValid = await isValidTwoFactorCode(code, user.two_factor_secret)

  if (!isCodeValid) {
    sendError(response, request, 401, 'Codul de autentificare este incorect.')
    return
  }

  await db.execute('UPDATE users SET last_login_at = NOW() WHERE id = ?', [user.id])

  const token = createSessionToken({
    sub: String(user.id),
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
  })

  sendJson(response, request, 200, { user: buildUserResponse(user) }, {
    'Set-Cookie': createCookie(token),
  })
}

async function handleMe(request, response) {
  const user = await getSessionUser(request)

  if (!user) {
    sendError(response, request, 401, 'Nu există o sesiune validă.')
    return
  }

  sendJson(response, request, 200, {
    user: buildUserResponse(user),
  })
}

async function handleAccountUpdate(request, response) {
  let body

  try {
    body = await parseJsonBody(request)
  } catch {
    sendError(response, request, 400, 'Cerere invalidă.')
    return
  }

  const currentUser = await getSessionUser(request)

  if (!currentUser) {
    sendError(response, request, 401, 'Nu există o sesiune validă.')
    return
  }

  const currentPassword = body.currentPassword || ''
  const newEmail = normalizeEmail(body.email || '')
  const newEmailConfirm = normalizeEmail(body.emailConfirm || '')
  const newPassword = body.password || ''
  const newPasswordConfirm = body.passwordConfirm || ''
  const wantsEmailUpdate = Boolean(newEmail || newEmailConfirm)
  const wantsPasswordUpdate = Boolean(newPassword || newPasswordConfirm)

  if (!wantsEmailUpdate && !wantsPasswordUpdate) {
    sendError(response, request, 400, 'Nu ai trimis nicio modificare.')
    return
  }

  if (!currentPassword) {
    sendError(response, request, 400, 'Trebuie să introduci parola actuală.')
    return
  }

  const db = getDbClient()
  const [rows] = await db.execute(
    'SELECT password_hash FROM users WHERE id = ? LIMIT 1',
    [currentUser.id]
  )
  const userForPassword = rows[0]

  if (!userForPassword) {
    sendError(response, request, 404, 'Contul nu a fost găsit.')
    return
  }

  const isPasswordValid = await verifyPassword(currentPassword, userForPassword.password_hash)

  if (!isPasswordValid) {
    sendError(response, request, 401, 'Parola actuală este incorectă.')
    return
  }

  const updates = []
  const params = []

  if (wantsEmailUpdate) {
    if (!newEmail || !newEmailConfirm) {
      sendError(response, request, 400, 'Completează adresa de email și confirmarea ei.')
      return
    }

    if (newEmail !== newEmailConfirm) {
      sendError(response, request, 400, 'Adresele de email nu coincid.')
      return
    }

    const [existingUsers] = await db.execute(
      'SELECT id FROM users WHERE email = ? AND id <> ? LIMIT 1',
      [newEmail, currentUser.id]
    )

    if (existingUsers.length > 0) {
      sendError(response, request, 409, 'Există deja un cont cu această adresă de email.')
      return
    }

    updates.push('email = ?')
    params.push(newEmail)
  }

  if (wantsPasswordUpdate) {
    if (!newPassword || !newPasswordConfirm) {
      sendError(response, request, 400, 'Completează parola nouă și confirmarea ei.')
      return
    }

    if (newPassword !== newPasswordConfirm) {
      sendError(response, request, 400, 'Parolele noi nu coincid.')
      return
    }

    if (newPassword.length < 8) {
      sendError(response, request, 400, 'Parola trebuie să aibă cel puțin 8 caractere.')
      return
    }

    updates.push('password_hash = ?')
    params.push(await hashPassword(newPassword))
  }

  updates.push('updated_at = CURRENT_TIMESTAMP')
  params.push(currentUser.id)

  await db.execute(
    `UPDATE users
     SET ${updates.join(', ')}
     WHERE id = ?`,
    params
  )

  const [updatedRows] = await db.execute(
    'SELECT id, first_name, last_name, email, role, two_factor_enabled FROM users WHERE id = ? LIMIT 1',
    [currentUser.id]
  )
  const updatedUser = updatedRows[0]

  if (!updatedUser) {
    sendError(response, request, 404, 'Contul nu a putut fi actualizat.')
    return
  }

  const token = createSessionToken({
    sub: String(updatedUser.id),
    email: updatedUser.email,
    firstName: updatedUser.first_name,
    lastName: updatedUser.last_name,
  })

  sendJson(
    response,
    request,
    200,
    {
      user: {
        id: updatedUser.id,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        email: updatedUser.email,
        role: updatedUser.role,
        twoFactorEnabled: Boolean(Number(updatedUser.two_factor_enabled || 0)),
      },
      message: 'Contul a fost actualizat cu succes.',
    },
    {
      'Set-Cookie': createCookie(token),
    }
  )
}

function normalizeTwoFactorCode(code) {
  return String(code || '').replace(/\D/g, '').slice(0, 6)
}

async function isValidTwoFactorCode(code, secret) {
  if (!code || !secret) {
    return false
  }

  const result = await verifyTotpToken({
    secret,
    token: code,
    epochTolerance: 30,
  })

  return Boolean(result && result.valid)
}

async function getUserForTwoFactor(userId) {
  const db = getDbClient()
  const [rows] = await db.execute(
    `SELECT id, first_name, last_name, email, password_hash, role, two_factor_enabled, two_factor_secret, two_factor_pending_secret
     FROM users
     WHERE id = ?
     LIMIT 1`,
    [userId]
  )

  return rows[0] ?? null
}

async function requirePasswordForUser(response, request, user, password) {
  if (!password) {
    sendError(response, request, 400, 'Parola actuală este obligatorie.')
    return false
  }

  const isPasswordValid = await verifyPassword(password, user.password_hash)

  if (!isPasswordValid) {
    sendError(response, request, 401, 'Parola actuală este incorectă.')
    return false
  }

  return true
}

async function handleTwoFactorSetup(request, response) {
  let body

  try {
    body = await parseJsonBody(request)
  } catch {
    sendError(response, request, 400, 'Cerere invalidă.')
    return
  }

  const currentUser = await getSessionUser(request)

  if (!currentUser) {
    sendError(response, request, 401, 'Nu există o sesiune validă.')
    return
  }

  const user = await getUserForTwoFactor(currentUser.id)

  if (!user) {
    sendError(response, request, 404, 'Contul nu a fost găsit.')
    return
  }

  if (Number(user.two_factor_enabled || 0) === 1) {
    sendError(response, request, 400, 'Autentificarea în 2 pași este deja activă.')
    return
  }

  const hasValidPassword = await requirePasswordForUser(response, request, user, body.currentPassword || '')

  if (!hasValidPassword) {
    return
  }

  const secret = generateTotpSecret()
  const otpAuthUrl = generateTotpUri({
    issuer: 'Fructul Bucovinei',
    label: user.email,
    secret,
  })
  const qrCodeDataUrl = await QRCode.toDataURL(otpAuthUrl, {
    margin: 1,
    width: 240,
  })
  const db = getDbClient()

  await db.execute(
    'UPDATE users SET two_factor_pending_secret = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [secret, user.id]
  )

  sendJson(response, request, 200, {
    qrCodeDataUrl,
    manualKey: secret,
    otpAuthUrl,
  })
}

async function handleTwoFactorVerify(request, response) {
  let body

  try {
    body = await parseJsonBody(request)
  } catch {
    sendError(response, request, 400, 'Cerere invalidă.')
    return
  }

  const currentUser = await getSessionUser(request)

  if (!currentUser) {
    sendError(response, request, 401, 'Nu există o sesiune validă.')
    return
  }

  const user = await getUserForTwoFactor(currentUser.id)
  const code = normalizeTwoFactorCode(body.code)

  if (!user || !user.two_factor_pending_secret) {
    sendError(response, request, 400, 'Nu există o configurare 2FA în așteptare.')
    return
  }

  if (!(await isValidTwoFactorCode(code, user.two_factor_pending_secret))) {
    sendError(response, request, 401, 'Codul de autentificare este incorect.')
    return
  }

  const db = getDbClient()
  await db.execute(
    `UPDATE users
     SET two_factor_enabled = 1,
         two_factor_secret = two_factor_pending_secret,
         two_factor_pending_secret = NULL,
         two_factor_enabled_at = NOW(),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [user.id]
  )

  sendJson(response, request, 200, {
    user: buildUserResponse({
      ...user,
      two_factor_enabled: 1,
    }),
    message: 'Autentificarea în 2 pași a fost activată.',
  })
}

async function handleTwoFactorDisable(request, response) {
  let body

  try {
    body = await parseJsonBody(request)
  } catch {
    sendError(response, request, 400, 'Cerere invalidă.')
    return
  }

  const currentUser = await getSessionUser(request)

  if (!currentUser) {
    sendError(response, request, 401, 'Nu există o sesiune validă.')
    return
  }

  const user = await getUserForTwoFactor(currentUser.id)

  if (!user) {
    sendError(response, request, 404, 'Contul nu a fost găsit.')
    return
  }

  if (Number(user.two_factor_enabled || 0) !== 1 || !user.two_factor_secret) {
    sendError(response, request, 400, 'Autentificarea în 2 pași nu este activă.')
    return
  }

  const hasValidPassword = await requirePasswordForUser(response, request, user, body.currentPassword || '')

  if (!hasValidPassword) {
    return
  }

  const code = normalizeTwoFactorCode(body.code)

  if (!(await isValidTwoFactorCode(code, user.two_factor_secret))) {
    sendError(response, request, 401, 'Codul de autentificare este incorect.')
    return
  }

  const db = getDbClient()
  await db.execute(
    `UPDATE users
     SET two_factor_enabled = 0,
         two_factor_secret = NULL,
         two_factor_pending_secret = NULL,
         two_factor_enabled_at = NULL,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [user.id]
  )

  sendJson(response, request, 200, {
    user: buildUserResponse({
      ...user,
      two_factor_enabled: 0,
    }),
    message: 'Autentificarea în 2 pași a fost dezactivată.',
  })
}


async function insertOrderAddress(connection, orderId, addressType, address) {
  await connection.execute(
    'INSERT INTO order_addresses (order_id, address_type, first_name, last_name, company, country, phone, street_address, address_extra, county, city, postal_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      orderId,
      addressType,
      address.firstName,
      address.lastName,
      address.company || null,
      address.country,
      address.phone,
      address.streetAddress,
      address.addressExtra || null,
      address.county,
      address.city,
      address.postalCode,
    ]
  )
}

async function getHydratedOrder(db, order) {
  const [items] = await db.execute(
    'SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC',
    [order.id]
  )
  const [addresses] = await db.execute(
    'SELECT * FROM order_addresses WHERE order_id = ? ORDER BY id ASC',
    [order.id]
  )

  return buildOrderResponse(order, items, addresses)
}

async function handleCreateOrder(request, response) {
  let body

  try {
    body = await parseJsonBody(request)
  } catch {
    sendError(response, request, 400, 'Cerere invalidă.')
    return
  }

  if (body.paymentMethod != null && body.paymentMethod !== 'cash') {
    sendError(response, request, 400, 'Momentan este disponibilă doar plata ramburs, la livrare.')
    return
  }

  const currentUser = await getSessionUser(request)
  const customerEmail = normalizeEmail(body.customerEmail || currentUser?.email)
  const paymentMethod = body.paymentMethod === 'card' ? 'card' : 'cash'
  const items = Array.isArray(body.items) ? body.items : []
  const billingAddress = normalizeAddress(body.billingAddress)
  const shippingAddress = body.shippingAddress
    ? normalizeAddress(body.shippingAddress)
    : billingAddress
  const requestedDiscountCode = getRequiredString(body.discountCode).toUpperCase()
  const discountPercent = getPromoDiscountPercent(requestedDiscountCode)
  const discountCode = discountPercent > 0 ? requestedDiscountCode : ''
  const customerNote = getRequiredString(body.customerNote) || null

  if (!customerEmail) {
    sendError(response, request, 400, 'Adresa de email este obligatorie.')
    return
  }

  if (!body.termsAccepted) {
    sendError(response, request, 400, 'Trebuie să accepți termenii și condițiile.')
    return
  }

  if (items.length === 0) {
    sendError(response, request, 400, 'Coșul este gol.')
    return
  }

  if (!validateAddress(billingAddress)) {
    sendError(response, request, 400, 'Completează toate câmpurile obligatorii pentru facturare.')
    return
  }

  if (!validateAddress(shippingAddress)) {
    sendError(response, request, 400, 'Completează toate câmpurile obligatorii pentru livrare.')
    return
  }

  if (paymentMethod === 'card') {
    try {
      assertNetopiaConfigured()
    } catch (error) {
      sendError(
        response,
        request,
        503,
        error instanceof Error ? error.message : 'Plata online nu este configurată momentan.'
      )
      return
    }
  }

  const db = getDbClient()
  const connection = await db.getConnection()

  try {
    await connection.beginTransaction()

    const preparedItems = []
    let subtotalAmount = 0

    for (const item of items) {
      const quantity = Math.max(1, Math.floor(Number(item.quantity)) || 1)
      const productSlug = normalizeProductSlug(item.slug)
      const [productRows] = await connection.execute(
        'SELECT id, slug, name, image, price, stock_quantity, status FROM products WHERE slug = ? LIMIT 1',
        [productSlug]
      )
      const product = productRows[0]
      const unitPrice = product ? Number(product.price) : parseAmount(item.price)
      const productName = product?.name || getRequiredString(item.name)
      const productImage = product?.image || getRequiredString(item.image) || null

      if (!productName || unitPrice <= 0) {
        throw new Error('Un produs din coș nu este valid.')
      }

      if (product) {
        if (product.status !== 'active' || Number(product.stock_quantity) < quantity) {
          throw new Error('Produsul ' + productName + ' nu are stoc suficient.')
        }

        const [stockUpdate] = await connection.execute(
          'UPDATE products SET stock_quantity = stock_quantity - ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND stock_quantity >= ?',
          [quantity, product.id, quantity]
        )

        if (stockUpdate.affectedRows !== 1) {
          throw new Error('Stocul produsului ' + productName + ' nu a putut fi actualizat.')
        }
      }

      const lineTotal = unitPrice * quantity
      subtotalAmount += lineTotal
      preparedItems.push({
        productId: product?.id || null,
        productSlug,
        productName,
        productImage,
        unitPrice,
        quantity,
        lineTotal,
        productSnapshot: JSON.stringify(item),
      })
    }

    const discountAmount = subtotalAmount * (discountPercent / 100)
    const shippingAmount = 0
    const totalAmount = subtotalAmount - discountAmount + shippingAmount
    const paymentStatus = paymentMethod === 'card' ? 'pending' : 'pending'
    const temporaryOrderNumber = `FBPENDING${Date.now()}${crypto.randomInt(1000, 9999)}`

    const [orderResult] = await connection.execute(
      'INSERT INTO orders (order_number, user_id, customer_email, status, payment_method, payment_status, currency, subtotal_amount, discount_code, discount_percent, discount_amount, shipping_amount, total_amount, customer_note, terms_accepted_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
      [
        temporaryOrderNumber,
        currentUser?.id || null,
        customerEmail,
        'pending',
        paymentMethod,
        paymentStatus,
        'RON',
        subtotalAmount,
        discountCode,
        discountPercent,
        discountAmount,
        shippingAmount,
        totalAmount,
        customerNote,
      ]
    )

    const orderId = orderResult.insertId
    const orderNumber = buildOrderNumber(orderId)

    await connection.execute(
      'UPDATE orders SET order_number = ? WHERE id = ?',
      [orderNumber, orderId]
    )

    for (const item of preparedItems) {
      await connection.execute(
        'INSERT INTO order_items (order_id, product_id, product_slug, product_name, product_image, unit_price, quantity, line_total, product_snapshot) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          orderId,
          item.productId,
          item.productSlug,
          item.productName,
          item.productImage,
          item.unitPrice,
          item.quantity,
          item.lineTotal,
          item.productSnapshot,
        ]
      )
    }

    await insertOrderAddress(connection, orderId, 'billing', billingAddress)
    await insertOrderAddress(connection, orderId, 'shipping', shippingAddress)

    const [createdRows] = await connection.execute(
      'SELECT * FROM orders WHERE id = ? LIMIT 1',
      [orderId]
    )

    await connection.commit()

    const order = await getHydratedOrder(db, createdRows[0])
    const paymentReturnToken = createPaymentReturnToken(order.orderNumber)
    if (paymentMethod === 'cash') {
      void sendOrderConfirmationMessage(order).catch((error) => {
        console.error('Order confirmation email failed:', error)
      })
    }

    if (paymentMethod === 'card') {
      let payment

      try {
        payment = createPaymentRequest({
          order,
          billingAddress,
          shippingAddress,
          siteBaseUrl: getSiteBaseUrl(),
          paymentReturnToken,
        })
      } catch (error) {
        console.error('NETOPIA payment request failed:', error)
        sendError(response, request, 503, 'Plata online nu a putut fi inițiată. Încearcă din nou.')
        return
      }

      sendJson(response, request, 201, {
        order,
        payment,
        paymentReturnToken,
      })
      return
    }

    sendJson(response, request, 201, { order, paymentReturnToken })
  } catch (error) {
    await connection.rollback()
    sendError(response, request, 400, error instanceof Error ? error.message : 'Comanda nu a putut fi salvată.')
  } finally {
    connection.release()
  }
}

function sendNetopiaXml(response, xml, status = 200) {
  response.writeHead(status, {
    'Content-Type': 'application/xml; charset=utf-8',
  })
  response.end(xml)
}

function getNetopiaOrderUpdate(notification) {
  if (notification.errorCode !== 0) {
    return {
      status: 'cancelled',
      paymentStatus: 'failed',
    }
  }

  if (notification.action === 'paid' || notification.action === 'confirmed') {
    return {
      status: 'confirmed',
      paymentStatus: 'paid',
    }
  }

  if (notification.action === 'credit') {
    return {
      status: 'refunded',
      paymentStatus: 'refunded',
    }
  }

  if (notification.action === 'canceled') {
    return {
      status: 'cancelled',
      paymentStatus: 'failed',
    }
  }

  return {
    status: 'pending',
    paymentStatus: 'pending',
  }
}

async function restoreReservedOrderStock(db, orderId) {
  const [items] = await db.execute(
    'SELECT product_id, quantity FROM order_items WHERE order_id = ? AND product_id IS NOT NULL',
    [orderId]
  )

  for (const item of items) {
    await db.execute(
      'UPDATE products SET stock_quantity = stock_quantity + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [Number(item.quantity) || 0, item.product_id]
    )
  }
}

async function handleNetopiaConfirm(request, response) {
  try {
    const body = await parseFormBody(request)
    const decryptedXml = decryptNotification({
      envKey: body.env_key || body.envKey,
      data: body.data,
      cipher: body.cipher,
      iv: body.iv,
    })
    const notification = parseNetopiaResponse(decryptedXml)

    if (!notification.orderId) {
      sendNetopiaXml(
        response,
        buildConfirmationResponse({
          errorType: '2',
          errorCode: '400',
          message: 'Lipsește identificatorul comenzii.',
        })
      )
      return
    }

    const db = getDbClient()
    const [rows] = await db.execute(
      'SELECT * FROM orders WHERE order_number = ? LIMIT 1',
      [notification.orderId]
    )
    const order = rows[0]

    if (!order) {
      sendNetopiaXml(
        response,
        buildConfirmationResponse({
          errorType: '2',
          errorCode: '404',
          message: 'Comanda nu a fost găsită.',
        })
      )
      return
    }

    if (order.payment_method !== 'card') {
      sendNetopiaXml(
        response,
        buildConfirmationResponse({
          errorType: '2',
          errorCode: '422',
          message: 'Comanda nu este configurată pentru plata cu cardul.',
        })
      )
      return
    }

    const reportedAmountText = notification.originalAmount || notification.processedAmount
    const reportedAmount = reportedAmountText ? Number(reportedAmountText) : null
    const orderAmount = Number(order.total_amount)

    if (reportedAmount !== null && Number.isFinite(reportedAmount) && Math.abs(reportedAmount - orderAmount) > 0.01) {
      sendNetopiaXml(
        response,
        buildConfirmationResponse({
          errorType: '2',
          errorCode: '422',
          message: 'Valoarea plății nu corespunde comenzii.',
        })
      )
      return
    }

    const update = getNetopiaOrderUpdate(notification)

    const isFailedPayment = update.paymentStatus === 'failed'
    let orderWasUpdated = false

    if (isFailedPayment) {
      const [updateResult] = await db.execute(
        'UPDATE orders SET status = ?, payment_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND payment_status = \'pending\'',
        [update.status, update.paymentStatus, order.id]
      )
      orderWasUpdated = updateResult.affectedRows === 1
    } else if (order.status !== update.status || order.payment_status !== update.paymentStatus) {
      const [updateResult] = await db.execute(
        'UPDATE orders SET status = ?, payment_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [update.status, update.paymentStatus, order.id]
      )
      orderWasUpdated = updateResult.affectedRows === 1
    }

    if (isFailedPayment && orderWasUpdated) {
      await restoreReservedOrderStock(db, order.id)
    }

    if (update.paymentStatus === 'paid' && orderWasUpdated) {
      const [confirmedRows] = await db.execute(
        'SELECT * FROM orders WHERE id = ? LIMIT 1',
        [order.id]
      )
      const confirmedOrder = await getHydratedOrder(db, confirmedRows[0])
      void sendOrderConfirmationMessage(confirmedOrder).catch((error) => {
        console.error('Confirmed payment email failed:', error)
      })
    }

    sendNetopiaXml(
      response,
      buildConfirmationResponse({ crc: notification.crc || notification.purchase || 'OK' })
    )
  } catch (error) {
    console.error('NETOPIA confirmation failed:', error)
    sendNetopiaXml(
      response,
      buildConfirmationResponse({
        errorType: '1',
        errorCode: '500',
        message: 'Eroare temporară la procesarea notificării.',
      })
    )
  }
}

async function handleListPublicProducts(request, response) {
  const url = new URL(request.url, 'http://localhost')
  const slugs = (url.searchParams.get('slugs') || '')
    .split(',')
    .map((slug) => normalizeProductSlug(slug))
    .filter(Boolean)
  const db = getDbClient()

  if (slugs.length > 0) {
    const uniqueSlugs = [...new Set(slugs)]
    const placeholders = uniqueSlugs.map(() => '?').join(', ')
    const [products] = await db.execute(
      'SELECT id, slug, name, description, image, price, stock_quantity, status, created_at, updated_at FROM products WHERE slug IN (' + placeholders + ')',
      uniqueSlugs
    )

    sendJson(response, request, 200, {
      products: products.map(buildProductResponse),
    })
    return
  }

  const [products] = await db.execute(
    "SELECT id, slug, name, description, image, price, stock_quantity, status, created_at, updated_at FROM products WHERE status = 'active' ORDER BY id ASC"
  )

  sendJson(response, request, 200, {
    products: products.map(buildProductResponse),
  })
}

async function handleGetPublicProduct(request, response, productSlug) {
  const slug = normalizeProductSlug(productSlug)

  if (!slug) {
    sendError(response, request, 400, 'Produs invalid.')
    return
  }

  const db = getDbClient()
  const [products] = await db.execute(
    'SELECT id, slug, name, description, image, price, stock_quantity, status, created_at, updated_at FROM products WHERE slug = ? LIMIT 1',
    [slug]
  )
  const product = products[0]

  if (!product) {
    sendError(response, request, 404, 'Produsul nu a fost găsit.')
    return
  }

  sendJson(response, request, 200, {
    product: buildProductResponse(product),
  })
}

async function handleAdminListProducts(request, response) {
  const currentUser = await requireAdminUser(request, response)

  if (!currentUser) {
    return
  }

  const db = getDbClient()
  const [products] = await db.execute(
    'SELECT id, slug, name, description, image, price, stock_quantity, status, created_at, updated_at FROM products ORDER BY id ASC'
  )

  sendJson(response, request, 200, {
    products: products.map(buildProductResponse),
  })
}

async function handleAdminUpdateProduct(request, response, productId) {
  const currentUser = await requireAdminUser(request, response)

  if (!currentUser) {
    return
  }

  const normalizedProductId = Number.parseInt(String(productId || ''), 10)

  if (!Number.isInteger(normalizedProductId) || normalizedProductId <= 0) {
    sendError(response, request, 400, 'Produs invalid.')
    return
  }

  const body = await parseJsonBody(request)
  const stockQuantity = Number(body.stockQuantity)

  if (!Number.isInteger(stockQuantity) || stockQuantity < 0) {
    sendError(response, request, 400, 'Cantitatea trebuie să fie un număr întreg pozitiv.')
    return
  }

  const db = getDbClient()
  const [updateResult] = await db.execute(
    'UPDATE products SET stock_quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [stockQuantity, normalizedProductId]
  )

  if (updateResult.affectedRows !== 1) {
    sendError(response, request, 404, 'Produsul nu a fost găsit.')
    return
  }

  const [rows] = await db.execute(
    'SELECT id, slug, name, description, image, price, stock_quantity, status, created_at, updated_at FROM products WHERE id = ? LIMIT 1',
    [normalizedProductId]
  )

  sendJson(response, request, 200, {
    product: buildProductResponse(rows[0]),
  })
}

async function handleAdminListOrders(request, response) {
  const currentUser = await requireAdminUser(request, response)

  if (!currentUser) {
    return
  }

  const url = new URL(request.url, 'http://localhost')
  const category = url.searchParams.get('category') === 'shipped' ? 'shipped' : 'received'
  const page = Math.max(1, Number.parseInt(url.searchParams.get('page') || '1', 10) || 1)
  const limit = Math.min(50, Math.max(1, Number.parseInt(url.searchParams.get('limit') || '10', 10) || 10))
  const offset = (page - 1) * limit
  const db = getDbClient()

  const whereClause = category === 'shipped' ? 'status = ?' : 'status <> ?'
  const whereParams = ['shipped']

  const [countRows] = await db.execute(
    `SELECT COUNT(*) AS total FROM orders WHERE ${whereClause}`,
    whereParams
  )

  const total = Number(countRows[0]?.total || 0)
  const [orders] = await db.execute(
    `SELECT * FROM orders WHERE ${whereClause} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`,
    whereParams
  )

  const hydratedOrders = []

  for (const order of orders) {
    hydratedOrders.push(await getHydratedOrder(db, order))
  }

  sendJson(response, request, 200, {
    orders: hydratedOrders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  })
}

async function handleAdminShipOrder(request, response, orderId) {
  const currentUser = await requireAdminUser(request, response)

  if (!currentUser) {
    return
  }

  const normalizedOrderId = Number.parseInt(String(orderId || ''), 10)

  if (!Number.isInteger(normalizedOrderId) || normalizedOrderId <= 0) {
    sendError(response, request, 400, 'Comandă invalidă.')
    return
  }

  const body = await parseJsonBody(request)
  const awb = String(body.awb || '').trim()

  if (!awb) {
    sendError(response, request, 400, 'Completează AWB-ul înainte să marchezi comanda ca trimisă.')
    return
  }

  if (awb.length > 100) {
    sendError(response, request, 400, 'AWB-ul este prea lung.')
    return
  }

  const db = getDbClient()
  const [updateResult] = await db.execute(
    "UPDATE orders SET status = 'shipped', awb = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    [awb, normalizedOrderId]
  )

  if (updateResult.affectedRows !== 1) {
    sendError(response, request, 404, 'Comanda nu a fost găsită.')
    return
  }

  const [rows] = await db.execute('SELECT * FROM orders WHERE id = ? LIMIT 1', [normalizedOrderId])
  const order = await getHydratedOrder(db, rows[0])
  void sendOrderShippedMessage(order).catch((error) => {
    console.error('Order shipped email failed:', error)
  })
  sendJson(response, request, 200, { order })
}

async function handleListOrders(request, response) {
  const currentUser = await getSessionUser(request)

  if (!currentUser) {
    sendError(response, request, 401, 'Trebuie să fii autentificat pentru a vedea comenzile.')
    return
  }

  const db = getDbClient()
  const isAdmin = currentUser.role === 'admin'
  const url = new URL(request.url, 'http://localhost')
  const page = Math.max(1, Number.parseInt(url.searchParams.get('page') || '1', 10) || 1)
  const limit = 5
  const offset = (page - 1) * limit
  const whereClause = isAdmin ? '1 = 1' : 'user_id = ?'
  const whereParams = isAdmin ? [] : [currentUser.id]
  const [countRows] = await db.execute(
    `SELECT COUNT(*) AS total FROM orders WHERE ${whereClause}`,
    whereParams
  )
  const total = Number(countRows[0]?.total || 0)
  const [orders] = await db.execute(
    `SELECT * FROM orders WHERE ${whereClause} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`,
    whereParams
  )

  const hydratedOrders = []

  for (const order of orders) {
    hydratedOrders.push(await getHydratedOrder(db, order))
  }

  sendJson(response, request, 200, {
    orders: hydratedOrders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  })
}

async function handleGetOrder(request, response, orderNumber) {
  const currentUser = await getSessionUser(request)
  const url = new URL(request.url, 'http://localhost')
  const normalizedOrderNumber = normalizeOrderNumber(orderNumber)
  const hasPaymentToken = isValidPaymentReturnToken(
    normalizedOrderNumber,
    url.searchParams.get('paymentToken')
  )

  if (!currentUser && !hasPaymentToken) {
    sendError(response, request, 401, 'Trebuie să fii autentificat pentru a vedea comanda.')
    return
  }

  const db = getDbClient()
  const isAdmin = currentUser?.role === 'admin'
  const [orders] = isAdmin
    ? await db.execute('SELECT * FROM orders WHERE order_number = ? LIMIT 1', [normalizedOrderNumber])
    : hasPaymentToken
      ? await db.execute('SELECT * FROM orders WHERE order_number = ? LIMIT 1', [normalizedOrderNumber])
      : await db.execute('SELECT * FROM orders WHERE order_number = ? AND user_id = ? LIMIT 1', [normalizedOrderNumber, currentUser.id])
  const order = orders[0]

  if (!order) {
    sendError(response, request, 404, 'Comanda nu a fost găsită.')
    return
  }

  sendJson(response, request, 200, { order: await getHydratedOrder(db, order) })
}

async function handleRequest(request, response) {
  const routePath = getRoutePath(request)

  if (request.method === 'OPTIONS') {
    response.writeHead(204, getCorsHeaders(request))
    response.end()
    return
  }

  try {
    if (request.method === 'GET' && (routePath === '/health' || routePath === '/api/health')) {
      sendJson(response, request, 200, { ok: true })
      return
    }

    if (!(await checkRateLimit(request, response, routePath))) {
      return
    }

    if (request.method === 'GET' && routePath === '/api/products') {
      await handleListPublicProducts(request, response)
      return
    }

    if (request.method === 'GET' && routePath.startsWith('/api/products/')) {
      await handleGetPublicProduct(request, response, routePath.replace('/api/products/', ''))
      return
    }

    if (request.method === 'GET' && routePath === '/api/admin/products') {
      await handleAdminListProducts(request, response)
      return
    }

    if (request.method === 'PATCH' && routePath.startsWith('/api/admin/products/')) {
      await handleAdminUpdateProduct(request, response, routePath.replace('/api/admin/products/', ''))
      return
    }

    if (request.method === 'GET' && routePath === '/api/admin/orders') {
      await handleAdminListOrders(request, response)
      return
    }

    if (request.method === 'PATCH' && routePath.startsWith('/api/admin/orders/') && routePath.endsWith('/ship')) {
      const orderId = routePath.replace('/api/admin/orders/', '').replace('/ship', '')
      await handleAdminShipOrder(request, response, orderId)
      return
    }

    if (request.method === 'GET' && routePath === '/api/payments/netopia/confirm') {
      sendError(response, request, 405, 'Endpointul NETOPIA este un webhook POST și nu poate fi deschis direct în browser.')
      return
    }

    if (request.method === 'POST' && routePath === '/api/payments/netopia/confirm') {
      await handleNetopiaConfirm(request, response)
      return
    }

    if (request.method === 'GET' && routePath === '/api/orders') {
      await handleListOrders(request, response)
      return
    }

    if (request.method === 'POST' && routePath === '/api/orders') {
      await handleCreateOrder(request, response)
      return
    }

    if (request.method === 'GET' && routePath.startsWith('/api/orders/')) {
      await handleGetOrder(request, response, routePath.replace('/api/orders/', ''))
      return
    }

    if (request.method === 'POST' && routePath === '/api/auth/register') {
      await handleRegister(request, response)
      return
    }

    if (request.method === 'POST' && routePath === '/api/auth/verify-email') {
      await handleVerifyEmail(request, response)
      return
    }

    if (request.method === 'POST' && routePath === '/api/auth/login') {
      await handleLogin(request, response)
      return
    }

    if (request.method === 'POST' && routePath === '/api/auth/forgot-password') {
      await handleForgotPassword(request, response)
      return
    }

    if (request.method === 'POST' && routePath === '/api/auth/reset-password') {
      await handleResetPassword(request, response)
      return
    }

    if (request.method === 'POST' && routePath === '/api/auth/login/2fa') {
      await handleTwoFactorLogin(request, response)
      return
    }

    if (request.method === 'GET' && routePath === '/api/auth/me') {
      await handleMe(request, response)
      return
    }

    if (request.method === 'PATCH' && routePath === '/api/auth/me') {
      await handleAccountUpdate(request, response)
      return
    }

    if (request.method === 'POST' && routePath === '/api/auth/2fa/setup') {
      await handleTwoFactorSetup(request, response)
      return
    }

    if (request.method === 'POST' && routePath === '/api/auth/2fa/verify') {
      await handleTwoFactorVerify(request, response)
      return
    }

    if (request.method === 'POST' && routePath === '/api/auth/2fa/disable') {
      await handleTwoFactorDisable(request, response)
      return
    }

    if (request.method === 'POST' && routePath === '/api/auth/logout') {
      sendJson(response, request, 200, { ok: true }, {
        'Set-Cookie': clearCookie(),
      })
      return
    }

    sendError(response, request, 404, 'Ruta nu există.')
  } catch (error) {
    console.error(error)
    sendError(response, request, 500, 'A apărut o eroare la server.')
  }
}

const server = httpModule.createServer(handleRequest)

if (usingUnitHttp) {
  server.listen()
} else {
  const port = Number(process.env.PORT || 3001)

  server.listen(port, () => {
    console.log(`Fructul Bucovinei backend runs on http://localhost:${port}`)
  })
}
