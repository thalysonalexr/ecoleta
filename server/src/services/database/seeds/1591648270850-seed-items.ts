import { QueryRunner, getConnection, MigrationInterface } from 'typeorm'

import { ItemRepository } from '@repositories/ItemRepository'

import { itemSeed } from '@services/database/seeds/items.seed'

export class seedItems1591648270850 implements MigrationInterface {
  public async up(_: QueryRunner): Promise<void> {
    const connection = getConnection(process.env.DATABASE_CONFIG)

    await connection.transaction(async (manager) => {
      const repository = manager.getCustomRepository(ItemRepository)

      await Promise.all(
        itemSeed.map(
          async ({ title, image }) =>
            await repository.createAndSave(title, image)
        )
      )
    })
  }

  public async down(_: QueryRunner): Promise<void> {}
}
