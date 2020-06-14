import path from 'path'
import faker from 'faker'
import request from 'supertest'
import { Connection } from 'typeorm'

import app from '@app/app'
import { destroyImage } from '@config/multer'

import { ItemRepository } from '@repositories/ItemRepository'
import { PointRepository } from '@repositories/PointRepository'

import { getConnection } from '@tests/utils/connect'
import { factoryPointData, factoryPointRepo } from '@tests/utils/factories'

faker.locale = 'pt_BR'

const version = 'v1'
const fileUpload = 'condado.jpg'
const fileLarge = 'too-large.jpg'
const fileUnsupported = 'unsupported.pdf'
const dirBase = path.resolve(__dirname, '..', 'tmp')

let connection: Connection | undefined

describe('Points', () => {
  beforeAll(async () => {
    connection = await getConnection()
  })

  beforeEach(async () => {
    connection?.manager.delete('points', {})
  })

  afterAll(async () => {
    connection?.close()
  })

  it(`POST /${version}/points Should be not able create new point collectage without image attach and 400 Bad Request`, async () => {
    const response = await request(app)
      .post(`/${version}/points`)
      .field('name', faker.name.findName())
      .field('email', faker.internet.email())
      .field('whatsapp', faker.phone.phoneNumber('########'))
      .field('latitude', Number(faker.address.latitude()))
      .field('longitude', Number(faker.address.longitude()))
      .field('city', faker.address.city())
      .field('uf', faker.address.state().substr(0, 2).toUpperCase())
      .field('items', faker.random.alphaNumeric(20))

    expect(response.status).toBe(400)
  })

  it(`POST /${version}/points Should be not able create new point collectage with invalid body and 400 Bad Request`, async () => {
    const response = await request(app)
      .post(`/${version}/points`)
      .field('name', faker.name.findName())
      .field('email', faker.internet.email())
      .field('whatsapp', faker.phone.phoneNumber('########'))
      .field('latitude', Number(faker.address.latitude()))
      .field('longitude', Number(faker.address.longitude()))
      .field('city', faker.address.city())
      .field('uf', faker.address.state().substr(0, 2).toUpperCase())
      .field('items', faker.random.alphaNumeric(20))
      .attach('image', path.join(dirBase, fileUpload))

    expect(response.status).toBe(400)
  })

  it(`POST /${version}/points Should not able create new point collectage with 415 Unsupported Media Type`, async () => {
    const repositoryItems = (connection as Connection).getCustomRepository(
      ItemRepository
    )

    const items = await repositoryItems.getAll()
    const itemsId = items.map((item) => item.id).join(',')

    const pointData = factoryPointData(itemsId)

    const response = await request(app)
      .post(`/${version}/points`)
      .field('name', pointData.email)
      .field('email', pointData.email)
      .field('whatsapp', pointData.whatsapp)
      .field('latitude', pointData.latitude)
      .field('longitude', pointData.longitude)
      .field('city', pointData.city)
      .field('uf', pointData.uf)
      .field('items', pointData.items)
      .attach('image', path.join(dirBase, fileUnsupported))

    expect(response.status).toBe(415)
  })

  it(`POST /${version}/points Should be no able create new point collectage with 413 Entity Too Large`, async () => {
    const repositoryItems = (connection as Connection).getCustomRepository(
      ItemRepository
    )

    const items = await repositoryItems.getAll()
    const itemsId = items.map((item) => item.id).join(',')

    const pointData = factoryPointData(itemsId)

    const response = await request(app)
      .post(`/${version}/points`)
      .field('name', pointData.email)
      .field('email', pointData.email)
      .field('whatsapp', pointData.whatsapp)
      .field('latitude', pointData.latitude)
      .field('longitude', pointData.longitude)
      .field('city', pointData.city)
      .field('uf', pointData.uf)
      .field('items', pointData.items)
      .attach('image', path.join(dirBase, fileLarge))

    expect(response.status).toBe(413)
  })

  it(`POST /${version}/points Should be not able create new point collectage with 201 Created`, async () => {
    const repositoryItems = (connection as Connection).getCustomRepository(
      ItemRepository
    )

    const items = await repositoryItems.getAll()
    const itemsId = items.map((item) => item.id).join(',')

    const pointData = factoryPointData(itemsId)

    const response = await request(app)
      .post(`/${version}/points`)
      .field('name', pointData.email)
      .field('email', pointData.email)
      .field('whatsapp', pointData.whatsapp)
      .field('latitude', pointData.latitude)
      .field('longitude', pointData.longitude)
      .field('city', pointData.city)
      .field('uf', pointData.uf)
      .field('items', pointData.items)
      .attach('image', path.join(dirBase, fileUpload))

    if (response.status === 201) {
      const { image } = response.body.point
      destroyImage(image)
    }

    expect(response.status).toBe(201)
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        point: expect.any(Object),
      })
    )
  })

  it(`GET /${version}/points Should be able not searched any point collectage with filter and 404 Not Found`, async () => {
    const conn = connection as Connection
    const repositoryItems = conn.getCustomRepository(ItemRepository)

    const items = await repositoryItems.getAll()
    const itemsId = items.map((item) => item.id)

    const city = faker.address.city()
    const uf = faker.address.state(true).substr(0, 2).toUpperCase()

    const response = await request(app).get(
      `/${version}/points?city=${city}&uf=${uf}&items=${itemsId.join(', ')}`
    )

    expect(response.status).toBe(404)
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        error: expect.any(String),
      })
    )
  })

  it(`GET /${version}/points Should be able get all points collectage with filter uf, city and 200 OK`, async () => {
    const conn = connection as Connection
    const repositoryItems = conn.getCustomRepository(ItemRepository)

    const items = await repositoryItems.getAll()

    const city = faker.address.city()
    const uf = faker.address.state(true).substr(0, 2).toUpperCase()

    const pointData = factoryPointRepo(items, city, uf)

    const repository = conn.getCustomRepository(PointRepository)
    await repository.createAndSave(pointData)

    const response = await request(app).get(
      `/${version}/points?city=${city}&uf=${uf}`
    )

    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        points: expect.arrayContaining([expect.any(Object)]),
      })
    )
  })

  it(`GET /${version}/points Should be able get all points collectage with filter uf, city and items and 200 OK`, async () => {
    const conn = connection as Connection
    const repositoryItems = conn.getCustomRepository(ItemRepository)

    const items = await repositoryItems.getAll()
    const itemsId = items.map((item) => item.id)

    const city = faker.address.city()
    const uf = faker.address.state(true).substr(0, 2).toUpperCase()

    const pointData = factoryPointRepo(items, city, uf)

    const repository = conn.getCustomRepository(PointRepository)
    await repository.createAndSave(pointData)

    const response = await request(app).get(
      `/${version}/points?city=${city}&uf=${uf}&items=${itemsId.join(', ')}`
    )

    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        points: expect.arrayContaining([expect.any(Object)]),
      })
    )
  })

  it(`GET /${version}/points Should be able not searched point collectage by id and 404 Not Found`, async () => {
    const response = await request(app).get(
      `/${version}/points/${faker.random.uuid()}`
    )

    expect(response.status).toBe(404)
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        error: expect.any(String),
      })
    )
  })

  it(`GET /${version}/points Should be able get point collectage by id with 200 OK`, async () => {
    const conn = connection as Connection
    const repositoryItems = conn.getCustomRepository(ItemRepository)

    const items = await repositoryItems.getAll()

    const pointData = factoryPointRepo(items)

    const repository = conn.getCustomRepository(PointRepository)
    const { id } = await repository.createAndSave(pointData)

    const response = await request(app).get(`/${version}/points/${id}`)

    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        point: expect.any(Object),
      })
    )
  })
})
