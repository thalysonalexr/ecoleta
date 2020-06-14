import faker from 'faker'
import { Connection } from 'typeorm'

import { getConnection } from '@tests/utils/connect'

import { Item } from '@entities/Item'
import { ItemRepository } from '@repositories/ItemRepository'

let connection: Connection | undefined

describe('Unit tests to Item Repository', () => {
  beforeAll(async () => {
    connection = await getConnection()
  })

  afterAll(async () => {
    await connection?.close()
  })

  test('Should be able create and save new item', async () => {
    const conn = connection as Connection
    const repository = conn.getCustomRepository(ItemRepository)

    const item = await repository.createAndSave(
      faker.name.title(),
      faker.internet.url()
    )

    expect(item).toBeInstanceOf(Item)
  })
})
