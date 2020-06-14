import { Request, Response, NextFunction } from 'express'
import { MulterError } from 'multer'

import multer from '@config/multer'

import { IMiddleware } from '@middlewares/IMiddleware'

export class Multer implements IMiddleware {
  private static upload = multer.single('image')

  public async process(req: Request, res: Response, next: NextFunction) {
    await Multer.upload(req, res, (err: any) => {
      if (!req.file && !err)
        return res.status(400).json({ error: 'Field image is required' })

      if (err instanceof MulterError && err.code === 'LIMIT_FILE_SIZE')
        return res
          .status(413)
          .json({ error: 'The file exceeds the allowed size.' })

      if (err instanceof Error)
        return res.status(415).json({ error: 'Unsupported Media Type' })

      return next()
    })
  }
}

export default new Multer().process
