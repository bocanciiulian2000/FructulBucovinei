import { NextResponse } from 'next/server'
import type { ResultSetHeader, RowDataPacket } from 'mysql2'
import { getDbPool } from '@/lib/db'
import {
  createSessionToken,
  hashPassword,
  normalizeEmail,
  normalizeName,
  setAuthCookie,
} from '@/lib/auth'

type RegisterPayload = {
  firstName?: string
  lastName?: string
  email?: string
  emailConfirm?: string
  password?: string
  passwordConfirm?: string
  termsAccepted?: boolean
}

type ExistingUserRow = RowDataPacket & {
  id: number
}

export async function POST(request: Request) {
  let body: RegisterPayload

  try {
    body = (await request.json()) as RegisterPayload
  } catch {
    return NextResponse.json({ error: 'Cerere invalidă.' }, { status: 400 })
  }

  const firstName = normalizeName(body.firstName ?? '')
  const lastName = normalizeName(body.lastName ?? '')
  const email = normalizeEmail(body.email ?? '')
  const emailConfirm = normalizeEmail(body.emailConfirm ?? '')
  const password = body.password ?? ''
  const passwordConfirm = body.passwordConfirm ?? ''

  if (!firstName || !lastName || !email || !emailConfirm || !password || !passwordConfirm) {
    return NextResponse.json({ error: 'Toate câmpurile sunt obligatorii.' }, { status: 400 })
  }

  if (!body.termsAccepted) {
    return NextResponse.json(
      { error: 'Trebuie să accepți termenii și condițiile și politica de confidențialitate.' },
      { status: 400 }
    )
  }

  if (email !== emailConfirm) {
    return NextResponse.json(
      { error: 'Adresele de email nu coincid.' },
      { status: 400 }
    )
  }

  if (password !== passwordConfirm) {
    return NextResponse.json(
      { error: 'Parolele nu coincid.' },
      { status: 400 }
    )
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: 'Parola trebuie să aibă cel puțin 8 caractere.' },
      { status: 400 }
    )
  }

  const db = getDbPool()
  const [existingUsers] = await db.execute<ExistingUserRow[]>(
    'SELECT id FROM users WHERE email = ? LIMIT 1',
    [email]
  )

  if (existingUsers.length > 0) {
    return NextResponse.json(
      { error: 'Există deja un cont cu această adresă de email.' },
      { status: 409 }
    )
  }

  const passwordHash = await hashPassword(password)
  const [result] = await db.execute<ResultSetHeader>(
    `INSERT INTO users (
      first_name,
      last_name,
      email,
      password_hash,
      terms_accepted_at
    ) VALUES (?, ?, ?, ?, NOW())`,
    [firstName, lastName, email, passwordHash]
  )

  const token = createSessionToken({
    sub: String(result.insertId),
    email,
    firstName,
    lastName,
  })

  const response = NextResponse.json(
    {
      user: {
        id: result.insertId,
        firstName,
        lastName,
        email,
      },
    },
    { status: 201 }
  )

  setAuthCookie(response, token)
  return response
}
