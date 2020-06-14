import 'reflect-metadata'
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm'

import { Point } from '@entities/Point'

@Entity('items')
export class Item {
  @PrimaryGeneratedColumn({ type: 'uuid' })
  id: string

  @Column({ type: 'varchar', length: 255 })
  image: string

  @Column({ type: 'varchar', length: 100 })
  title: string

  @ManyToMany(() => Point, (point) => point.items)
  points: Point[]
}
