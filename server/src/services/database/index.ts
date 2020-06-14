import { createConnection } from 'typeorm'

const connection = createConnection(process.env.DATABASE_CONFIG)
  .then(() => console.log('[database] connected sucessfully'))
  .catch((err) => console.log(err))

export default connection
