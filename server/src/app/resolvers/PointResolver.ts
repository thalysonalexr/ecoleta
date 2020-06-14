import { Request, Response } from 'express'
import { getConnection } from 'typeorm'

import { ItemRepository } from '@repositories/ItemRepository'
import { PointRepository } from '@repositories/PointRepository'

export interface PointData {
  name: string
  email: string
  whatsapp: string
  latitude: number
  longitude: number
  city: string
  uf: string
  items: string
}

export class PointResolver {
  async index(req: Request, res: Response) {
    const { city, uf, items } = req.query

    const parsedItems = items
      ? (items as string).split(',').map((item) => item.trim())
      : undefined

    const connection = getConnection(process.env.DATABASE_CONFIG)
    const repository = connection.getCustomRepository(PointRepository)

    const points = await repository.getAllByParams(
      city as string,
      uf as string,
      parsedItems
    )

    if (!points.length)
      return res.status(404).json({ error: 'No points were found' })

    const parsedPoints = points.map((point) => ({
      ...point,
      latitude: Number(point.latitude),
      longitude: Number(point.longitude),
    }))

    return res.json({ points: parsedPoints })
  }

  async show(req: Request, res: Response) {
    const { id } = req.params

    const connection = getConnection(process.env.DATABASE_CONFIG)
    const repository = connection.getCustomRepository(PointRepository)

    const point = await repository.getById(id)

    if (!point) return res.status(404).json({ error: 'Point not found.' })

    const parsedPoint = {
      ...point,
      latitude: Number(point.latitude),
      longitude: Number(point.longitude),
    }

    return res.json({ point: parsedPoint })
  }

  async store(req: Request, res: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    }: PointData = req.body

    const image = req.file.filename

    const connection = getConnection(process.env.DATABASE_CONFIG)

    const itemsRepository = connection.getCustomRepository(ItemRepository)
    const filteredItems = items.split(',')

    const itemsEntities = await itemsRepository.getByIds(filteredItems)

    const pointRepository = connection.getCustomRepository(PointRepository)
    const point = await pointRepository.createAndSave({
      image,
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items: itemsEntities,
    })

    return res.status(201).json({ point })
  }
}

export default new PointResolver()
