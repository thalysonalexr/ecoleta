import { Router } from 'express'
import { errors } from 'celebrate'

import Multer from '@middlewares/Multer'
import Compress from '@middlewares/Compress'
import DestroyUploadFile from '@middlewares/DestroyUploadFile'

import {
  validateGetAll,
  validateGetById,
  validateCreateNewPoint,
} from '@validators/validate-points'

import ItemResolver from '@resolvers/ItemResolver'
import PointResolver from '@resolvers/PointResolver'

const routing = Router()

routing.get('/', (_, res) => {
  return res.json({
    api: process.env.APP_NAME,
    docs: 'https://github.com/thalysonalexr/ecoleta/blob/master/server',
  })
})

routing.get('/items', ItemResolver.index)
routing.get('/points', validateGetAll(), PointResolver.index)
routing.get('/points/:id', validateGetById(), PointResolver.show)

routing.post(
  '/points',
  Multer,
  validateCreateNewPoint(),
  Compress,
  PointResolver.store
)

routing.use(DestroyUploadFile)
routing.use(errors())

export default routing
