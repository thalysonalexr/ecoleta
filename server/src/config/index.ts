import { config } from 'dotenv'

const env = {
  test: '.env.test',
  development: '.env.dev',
  production: '.env',
}

config({ path: env[process.env.NODE_ENV] })
