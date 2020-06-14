import { Request, Response, ErrorRequestHandler, NextFunction } from 'express'

export interface IMiddleware {
  process:
    | ((
        err: ErrorRequestHandler,
        req: Request,
        res: Response,
        next: NextFunction
      ) => Promise<any> | Response<any> | void)
    | ((
        req: Request,
        res: Response,
        next: NextFunction
      ) => Promise<any> | Response<any> | void)
}
