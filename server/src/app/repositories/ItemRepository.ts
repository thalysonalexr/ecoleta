import 'reflect-metadata'
import { EntityRepository, AbstractRepository } from 'typeorm'

import { Item } from '@entities/Item'

@EntityRepository(Item)
export class ItemRepository extends AbstractRepository<Item> {
  async createAndSave(title: string, image: string) {
    const item = new Item()

    item.title = title
    item.image = image

    return await this.manager.save(item)
  }

  async getAll() {
    return await this.manager.find(Item)
  }

  async getByIds(ids: string[]) {
    return await this.manager.findByIds(Item, ids)
  }
}
