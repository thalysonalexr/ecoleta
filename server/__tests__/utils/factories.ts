import faker from 'faker'

import { Item } from '@entities/Item'
import { PointData as Data } from '@resolvers/PointResolver'
import { PointData as Repo } from '@repositories/PointRepository'

export function factoryPointData(itemsId: string) {
  const pointData: Data = {
    name: faker.name.title(),
    email: faker.internet.email(),
    whatsapp: faker.phone.phoneNumber('+#############'),
    latitude: Number(faker.address.latitude()),
    longitude: Number(faker.address.latitude()),
    city: faker.address.city(),
    uf: faker.address.state(true).substr(0, 2).toUpperCase(),
    items: itemsId,
  }

  return pointData
}

export function factoryPointRepo(items: Item[], city?: string, uf?: string) {
  const pointRepo: Repo = {
    image: faker.internet.url(),
    name: faker.name.title(),
    email: faker.internet.email(),
    whatsapp: faker.phone.phoneNumber('+#############'),
    latitude: Number(faker.address.latitude()),
    longitude: Number(faker.address.latitude()),
    city: city ? city : faker.address.city(),
    uf: uf ? uf : faker.address.state(true).substr(0, 2).toUpperCase(),
    items,
  }

  return pointRepo
}
