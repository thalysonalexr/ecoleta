import { isCelebrate } from 'celebrate'
import { destroyImage } from '@config/multer'
import { Request, Response, ErrorRequestHandler, NextFunction } from 'express'

import { IMiddleware } from '@middlewares/IMiddleware'

export class DestroyUploadFile implements IMiddleware {
  public async process(
    err: ErrorRequestHandler,
    req: Request,
    _: Response,
    next: NextFunction
  ) {
    /* istanbul ignore else */
    if (isCelebrate(err) && req.file) {
      destroyImage(req.file.filename)
    }

    return next(err)
  }
}

export default new DestroyUploadFile().process
