import request from 'supertest'
import { Connection } from 'typeorm'

import app from '@app/app'
import { getConnection } from '@tests/utils/connect'

const version = 'v1'

let connection: Connection | undefined

describe('Items', () => {
  beforeAll(async () => {
    connection = await getConnection()
  })

  afterAll(async () => {
    await connection?.close()
  })

  it(`GET /${version}/items Should be able get all items with 200 OK`, async () => {
    const response = await request(app).get(`/${version}/items`)

    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        items: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            title: expect.any(String),
            image_url: expect.any(String),
          }),
        ]),
      })
    )
  })
})
