import 'reflect-metadata'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm'

import { Item } from '@entities/Item'

@Entity('points')
export class Point {
  @PrimaryGeneratedColumn({ type: 'uuid' })
  id: string

  @Column({ type: 'varchar', length: 255 })
  image: string

  @Column({ type: 'varchar', length: 255 })
  name: string

  @Column({ type: 'varchar', length: 100 })
  email: string

  @Column({ type: 'varchar', length: 20 })
  whatsapp: string

  @Column({ type: 'decimal' })
  latitude: number

  @Column({ type: 'decimal' })
  longitude: number

  @Column({ type: 'varchar', length: 45 })
  city: string

  @Column({ type: 'char', length: 2 })
  uf: string

  @ManyToMany(() => Item, (item) => item.points)
  @JoinTable({ name: 'point_items' })
  items: Item[]
}
