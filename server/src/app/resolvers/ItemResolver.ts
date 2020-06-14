import { Request, Response } from 'express'
import { getConnection } from 'typeorm'

import { ItemRepository } from '@repositories/ItemRepository'

export class ItemResolver {
  async index(req: Request, res: Response) {
    const connection = getConnection(process.env.DATABASE_CONFIG)
    const repository = connection.getCustomRepository(ItemRepository)
    const items = await repository.getAll()

    const version = process.env.VERSION
    const baseURL = `${req.protocol}://${req.get('host')}/${version}`

    const serializedItems = items.map(({ id, title, image }) => ({
      id,
      title,
      image_url: `${baseURL}/uploads/${image}`,
    }))

    return res.json({ items: serializedItems })
  }
}

export default new ItemResolver()
