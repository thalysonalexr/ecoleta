import 'reflect-metadata'
import { EntityRepository, AbstractRepository } from 'typeorm'

import { Point } from '@entities/Point'
import { Item } from '@entities/Item'

export interface PointData {
  image: string
  name: string
  email: string
  whatsapp: string
  latitude: number
  longitude: number
  city: string
  uf: string
  items: Item[]
}

@EntityRepository(Point)
export class PointRepository extends AbstractRepository<Point> {
  async createAndSave(pointData: PointData) {
    const point = new Point()

    point.image = pointData.image
    point.name = pointData.name
    point.email = pointData.email
    point.whatsapp = pointData.whatsapp
    point.latitude = pointData.latitude
    point.longitude = pointData.longitude
    point.city = pointData.city
    point.uf = pointData.uf
    point.items = pointData.items

    return await this.manager.save(point)
  }

  async getById(id: string) {
    return await this.manager.findOne<Point>(Point, {
      relations: ['items'],
      where: { id },
    })
  }

  async getAllByParams(city: string, uf: string, items?: string[]) {
    return await this.manager
      .createQueryBuilder(Point, 'points')
      .addSelect('points.id', 'points_id')
      .leftJoin(
        'point_items',
        'point_items',
        'points.id = point_items.pointsId'
      )
      .where(
        `points.city = :city AND points.uf = :uf ${
          items ? 'AND point_items.itemsId IN (:...items)' : ''
        }`,
        {
          items,
          city,
          uf,
        }
      )
      .distinct()
      .getMany()
  }
}
