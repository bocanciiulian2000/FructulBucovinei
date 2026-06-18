const crypto = require('crypto')
const { URL } = require('url')
const mysql = require('mysql2/promise')

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

let dbClient = null

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

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase()
}

function normalizeName(name) {
  return String(name || '').trim().replace(/\s+/g, ' ')
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
    `SELECT id, first_name, last_name, email, password_hash
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
  const [existingUsers] = await db.execute(
    'SELECT id FROM users WHERE email = ? LIMIT 1',
    [email]
  )

  if (existingUsers.length > 0) {
    sendError(response, request, 409, 'Există deja un cont cu această adresă de email.')
    return
  }

  const passwordHash = await hashPassword(password)
  const [result] = await db.execute(
    `INSERT INTO users (
      first_name,
      last_name,
      email,
      password_hash,
      terms_accepted_at
    ) VALUES (?, ?, ?, ?, NOW())`,
    [firstName, lastName, email, passwordHash]
  )

  const user = {
    id: result.insertId,
    firstName,
    lastName,
    email,
  }
  const token = createSessionToken({
    sub: String(user.id),
    email,
    firstName,
    lastName,
  })

  sendJson(response, request, 201, { user }, {
    'Set-Cookie': createCookie(token),
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
  const [rows] = await db.execute(
    `SELECT id, first_name, last_name, email, password_hash
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

  await db.execute('UPDATE users SET last_login_at = NOW() WHERE id = ?', [
    user.id,
  ])

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
    'SELECT id, first_name, last_name, email FROM users WHERE id = ? LIMIT 1',
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
      },
      message: 'Contul a fost actualizat cu succes.',
    },
    {
      'Set-Cookie': createCookie(token),
    }
  )
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

    if (request.method === 'POST' && routePath === '/api/auth/register') {
      await handleRegister(request, response)
      return
    }

    if (request.method === 'POST' && routePath === '/api/auth/login') {
      await handleLogin(request, response)
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
