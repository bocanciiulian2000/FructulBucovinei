import { NextResponse } from 'next/server'
import type { RowDataPacket } from 'mysql2'
import { getDbPool } from '@/lib/db'
import {
  createSessionToken,
  normalizeEmail,
  setAuthCookie,
  verifyPassword,
} from '@/lib/auth'

type LoginPayload = {
  email?: string
  password?: string
}

type LoginUserRow = RowDataPacket & {
  id: number
  first_name: string
  last_name: string
  email: string
  password_hash: string
}

export async function POST(request: Request) {
  let body: LoginPayload

  try {
    body = (await request.json()) as LoginPayload
  } catch {
    return NextResponse.json({ error: 'Cerere invalidă.' }, { status: 400 })
  }

  const email = normalizeEmail(body.email ?? '')
  const password = body.password ?? ''

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Emailul și parola sunt obligatorii.' },
      { status: 400 }
    )
  }

  const db = getDbPool()
  const [rows] = await db.execute<LoginUserRow[]>(
    `SELECT id, first_name, last_name, email, password_hash
     FROM users
     WHERE email = ?
     LIMIT 1`,
    [email]
  )

  const user = rows[0]

  if (!user) {
    return NextResponse.json(
      { error: 'Datele de autentificare sunt incorecte.' },
      { status: 401 }
    )
  }

  const isPasswordValid = await verifyPassword(password, user.password_hash)

  if (!isPasswordValid) {
    return NextResponse.json(
      { error: 'Datele de autentificare sunt incorecte.' },
      { status: 401 }
    )
  }

  await db.execute('UPDATE users SET last_login_at = NOW() WHERE id = ?', [
    user.id,
  ])

  const token = createSessionToken({
    sub: String(user.id),
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
  })

  const response = NextResponse.json({
    user: {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
    },
  })

  setAuthCookie(response, token)
  return response
}
