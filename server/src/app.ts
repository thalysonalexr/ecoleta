import '@config/index'

import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import compression from 'compression'
import routing from './routing'
import path from 'path'

const app = express()

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(morgan('dev'))
app.use(compression())
app.use('/v1', routing)
app.use('/v1/uploads', express.static(path.resolve(__dirname, '..', 'tmp')))

export default app
