import 'server-only'

import mysql from 'mysql2/promise'

let dbPool: mysql.Pool | null = null

function getDbConfig() {
  const dbUser = process.env.DB_USER
  const dbPassword = process.env.DB_PASSWORD
  const dbName = process.env.DB_NAME

  if (!dbUser || !dbPassword || !dbName) {
    throw new Error(
      'Missing database environment variables. Set DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME.'
    )
  }

  return {
    host: process.env.DB_HOST ?? 'localhost',
    user: dbUser,
    password: dbPassword,
    database: dbName,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  }
}

export function getDbPool() {
  if (!dbPool) {
    dbPool = mysql.createPool(getDbConfig())
  }

  return dbPool
}

export async function testDatabaseConnection() {
  const connection = await getDbPool().getConnection()

  try {
    await connection.query('SELECT 1')
  } finally {
    connection.release()
  }
}
