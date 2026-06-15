import 'server-only'

import crypto from 'crypto'
import { cookies } from 'next/headers'
import type { NextResponse } from 'next/server'

export const AUTH_COOKIE_NAME = 'fructul-bucovinei-session'
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30

type SessionPayload = {
  sub: string
  email: string
  firstName: string
  lastName: string
  exp: number
}

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET

  if (!secret) {
    throw new Error('Missing AUTH_SECRET environment variable.')
  }

  return secret
}

function toBase64Url(value: string) {
  return Buffer.from(value).toString('base64url')
}

function fromBase64Url(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8')
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export function normalizeName(name: string) {
  return name.trim().replace(/\s+/g, ' ')
}

export async function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex')
  const derivedKey = await new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (error, result) => {
      if (error) {
        reject(error)
        return
      }

      resolve(result as Buffer)
    })
  })

  return `${salt}:${derivedKey.toString('hex')}`
}

export async function verifyPassword(password: string, storedHash: string) {
  const [salt, expectedHash] = storedHash.split(':')

  if (!salt || !expectedHash) {
    return false
  }

  const derivedKey = await new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (error, result) => {
      if (error) {
        reject(error)
        return
      }

      resolve(result as Buffer)
    })
  })

  const expectedBuffer = Buffer.from(expectedHash, 'hex')

  if (derivedKey.length !== expectedBuffer.length) {
    return false
  }

  return crypto.timingSafeEqual(derivedKey, expectedBuffer)
}

function signSessionPayload(payload: SessionPayload) {
  const serializedPayload = toBase64Url(JSON.stringify(payload))
  const signature = crypto
    .createHmac('sha256', getAuthSecret())
    .update(serializedPayload)
    .digest('base64url')

  return `${serializedPayload}.${signature}`
}

function verifySessionToken(token: string) {
  const [serializedPayload, signature] = token.split('.')

  if (!serializedPayload || !signature) {
    return null
  }

  const expectedSignature = crypto
    .createHmac('sha256', getAuthSecret())
    .update(serializedPayload)
    .digest('base64url')

  if (
    signature.length !== expectedSignature.length ||
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
  ) {
    return null
  }

  const payload = JSON.parse(fromBase64Url(serializedPayload)) as SessionPayload

  if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
    return null
  }

  return payload
}

export function createSessionToken(payload: Omit<SessionPayload, 'exp'>) {
  return signSessionPayload({
    ...payload,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  })
}

export function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  })
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set(AUTH_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
}

export function getSessionUserId() {
  const token = cookies().get(AUTH_COOKIE_NAME)?.value

  if (!token) {
    return null
  }

  try {
    const payload = verifySessionToken(token)
    return payload?.sub ?? null
  } catch {
    return null
  }
}

export function createAuthCookieValue(token: string) {
  return token
}
