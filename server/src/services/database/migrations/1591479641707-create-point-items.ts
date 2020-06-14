import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm'

export class createPointItems1591479641707 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`)

    await queryRunner.createTable(
      new Table({
        name: 'point_items',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isUnique: true,
            generationStrategy: 'uuid',
            default: `uuid_generate_v4()`,
          },
          {
            name: 'pointsId',
            type: 'uuid',
          },
          {
            name: 'itemsId',
            type: 'uuid',
          },
        ],
      }),
      true
    )

    await queryRunner.createForeignKey(
      'point_items',
      new TableForeignKey({
        columnNames: ['pointsId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'points',
        onDelete: 'CASCADE',
      })
    )

    await queryRunner.createForeignKey(
      'point_items',
      new TableForeignKey({
        columnNames: ['itemsId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'items',
        onDelete: 'CASCADE',
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('point_items')
  }
}
