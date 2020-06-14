import { createConnection, Connection } from 'typeorm'

let connection: Connection | undefined

export async function getConnection() {
  if (connection) return connection

  try {
    connection = await createConnection(process.env.DATABASE_CONFIG)
    return connection
  } catch (err) {
    console.log(`[database:test] > ${err.message}`)
  }
}
