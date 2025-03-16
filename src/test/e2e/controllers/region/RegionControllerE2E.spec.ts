import { faker } from '@faker-js/faker'
import { ExpressServer } from '../../../../core/server/ExpressServer'
import { env } from '../../../../infrastructure/config/env'
import regionRoute from '../../../../interface/routes/region/RegionRoute'
import userRoute from '../../../../interface/routes/user/UserRoute'
import { describe } from 'mocha'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import supertest from 'supertest'
import { expect } from 'chai'

let mongoServer: MongoMemoryServer

const server = new ExpressServer(env.SERVER_PORT, [userRoute, regionRoute])

const app = server.app

before(async () => {
  mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()
  await mongoose.connect(uri)
})

after(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

afterEach(async () => {
  const collections = await mongoose.connection.db.collections()
  for (const collection of collections) {
    await collection.deleteMany({})
  }
})

describe('CreateRegionController', function () {
  this.timeout(20000)

  it('should be able to create region', async () => {
    const userCreated = await supertest(app)
      .post('/api/users')
      .send({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        coordinates: [faker.location.longitude(), faker.location.latitude()],
      })
    const userId = userCreated.body.user._id

    const firstAndFinalCoordinate = [
      faker.location.longitude(),
      faker.location.latitude(),
    ]

    const response = await supertest(app)
      .post('/api/regions')
      .send({
        name: faker.location.city(),
        polygonCoordinates: [
          [
            firstAndFinalCoordinate,
            [faker.location.longitude(), faker.location.latitude()],
            [faker.location.longitude(), faker.location.latitude()],
            [faker.location.longitude(), faker.location.latitude()],
            firstAndFinalCoordinate,
          ],
        ],
        userId,
      })
      .expect(201)

    expect(response.body.region.user).to.be.equal(userId)
  })
})
describe('DeleteRegionController', function () {
  this.timeout(20000)

  it('should be able to delete region', async () => {
    const userCreated = await supertest(app)
      .post('/api/users')
      .send({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        coordinates: [faker.location.longitude(), faker.location.latitude()],
      })
    const userId = userCreated.body.user._id

    const firstAndFinalCoordinate = [
      faker.location.longitude(),
      faker.location.latitude(),
    ]

    const regionCreated = await supertest(app)
      .post('/api/regions')
      .send({
        name: faker.location.city(),
        polygonCoordinates: [
          [
            firstAndFinalCoordinate,
            [faker.location.longitude(), faker.location.latitude()],
            [faker.location.longitude(), faker.location.latitude()],
            [faker.location.longitude(), faker.location.latitude()],
            firstAndFinalCoordinate,
          ],
        ],
        userId,
      })

    const regionId = regionCreated.body.region._id

    await supertest(app).delete(`/api/regions/${regionId}`).send().expect(204)
  })

  it('should not be able to delete region, NOT FOUND', async () => {
    await supertest(app).delete(`/api/regions/1234413`).send().expect(404)
  })
})
describe('FetchRegionController', function () {
  this.timeout(20000)

  it('should be able to fecth regions', async () => {
    const userCreated1 = await supertest(app)
      .post('/api/users')
      .send({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        coordinates: [faker.location.longitude(), faker.location.latitude()],
      })
    const userId1 = userCreated1.body.user._id

    const firstAndFinalCoordinate1 = [
      faker.location.longitude(),
      faker.location.latitude(),
    ]

    await supertest(app)
      .post('/api/regions')
      .send({
        name: faker.location.city(),
        polygonCoordinates: [
          [
            firstAndFinalCoordinate1,
            [faker.location.longitude(), faker.location.latitude()],
            [faker.location.longitude(), faker.location.latitude()],
            [faker.location.longitude(), faker.location.latitude()],
            firstAndFinalCoordinate1,
          ],
        ],
        userId: userId1,
      })

    const userCreated = await supertest(app)
      .post('/api/users')
      .send({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        coordinates: [faker.location.longitude(), faker.location.latitude()],
      })
    const userId = userCreated.body.user._id

    const firstAndFinalCoordinate = [
      faker.location.longitude(),
      faker.location.latitude(),
    ]

    await supertest(app)
      .post('/api/regions')
      .send({
        name: faker.location.city(),
        polygonCoordinates: [
          [
            firstAndFinalCoordinate,
            [faker.location.longitude(), faker.location.latitude()],
            [faker.location.longitude(), faker.location.latitude()],
            [faker.location.longitude(), faker.location.latitude()],
            firstAndFinalCoordinate,
          ],
        ],
        userId,
      })

    const response = await supertest(app).get(`/api/regions`).send().expect(200)

    expect(response.body.regions).length(2)
  })
})
describe('FetchRegionsByDistanceController', function () {
  this.timeout(20000)

  it('should be able to fecth regions by distance', async () => {
    const userCoordinates = [19.54938276487141, 0.46958770272320294]

    const userCreated = await supertest(app)
      .post('/api/users')
      .send({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        coordinates: [userCoordinates[0], userCoordinates[1]],
      })
    const userId = userCreated.body.user._id

    await supertest(app)
      .post(`/api/regions/`)
      .send({
        name: faker.location.city(),
        polygonCoordinates: [
          [
            [17.832521396102237, 4.578700349308974],
            [17.735340563908636, 1.230748153354341],
            [22.416217314608673, 1.1821685104063278],
            [22.61057897899815, 4.740133072759676],
            [17.832521396102237, 4.578700349308974],
          ],
        ],

        userId,
      })

    const response = await supertest(app)
      .get(`/api/regions/${userCoordinates[0]}/${userCoordinates[1]}/1000000`)
      .send()
      .expect(200)

    expect(response.body.regions).length(1)
  })
  it('should be able to fecth regions by distance, using userId', async () => {
    const userCoordinates = [19.54938276487141, 0.46958770272320294]

    const userCreated = await supertest(app)
      .post('/api/users')
      .send({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        coordinates: [userCoordinates[0], userCoordinates[1]],
      })
    const userId = userCreated.body.user._id

    await supertest(app)
      .post(`/api/regions/`)
      .send({
        name: faker.location.city(),
        polygonCoordinates: [
          [
            [17.832521396102237, 4.578700349308974],
            [17.735340563908636, 1.230748153354341],
            [22.416217314608673, 1.1821685104063278],
            [22.61057897899815, 4.740133072759676],
            [17.832521396102237, 4.578700349308974],
          ],
        ],

        userId,
      })

    await supertest(app)
      .post(`/api/regions/`)
      .send({
        name: faker.location.city(),
        polygonCoordinates: [
          [
            [17.832521396102237, 4.578700349308974],
            [17.735340563908636, 1.230748153354341],
            [22.416217314608673, 1.1821685104063278],
            [22.61057897899815, 4.740133072759676],
            [17.832521396102237, 4.578700349308974],
          ],
        ],

        userId: '67d618ee3e61c40a5b201b63',
      })

    const response = await supertest(app)
      .get(
        `/api/regions/${userCoordinates[0]}/${userCoordinates[1]}/1000000/${userId}`,
      )
      .send()
      .expect(200)

    expect(response.body.regions).length(1)
  })
})
describe('FetchRegionsByDistanceController', function () {
  this.timeout(20000)

  it('should be able to fecth regions by coordinates', async () => {
    const userCoordinates = [19.37121790584814, 3.189008451890416]

    const userCreated = await supertest(app)
      .post('/api/users')
      .send({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        coordinates: [userCoordinates[0], userCoordinates[1]],
      })

    const userId = userCreated.body.user._id

    await supertest(app)
      .post(`/api/regions/`)
      .send({
        name: faker.location.city(),
        polygonCoordinates: [
          [
            [17.832521396102237, 4.578700349308974],
            [17.735340563908636, 1.230748153354341],
            [22.416217314608673, 1.1821685104063278],
            [22.61057897899815, 4.740133072759676],
            [17.832521396102237, 4.578700349308974],
          ],
        ],
        userId,
      })

    const response = await supertest(app)
      .get(`/api/regions/${userCoordinates[0]}/${userCoordinates[1]}`)
      .send()
      .expect(200)

    expect(response.body.regions).length(1)
  })
})
describe('GetRegionController', function () {
  this.timeout(20000)

  it('should be able to get region by id', async () => {
    const userCoordinates = [19.37121790584814, 3.189008451890416]

    const userCreated = await supertest(app)
      .post('/api/users')
      .send({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        coordinates: [userCoordinates[0], userCoordinates[1]],
      })

    const userId = userCreated.body.user._id

    const regionCreated = await supertest(app)
      .post(`/api/regions/`)
      .send({
        name: faker.location.city(),
        polygonCoordinates: [
          [
            [17.832521396102237, 4.578700349308974],
            [17.735340563908636, 1.230748153354341],
            [22.416217314608673, 1.1821685104063278],
            [22.61057897899815, 4.740133072759676],
            [17.832521396102237, 4.578700349308974],
          ],
        ],
        userId,
      })

    const regionId = regionCreated.body.region._id

    await supertest(app).get(`/api/regions/${regionId}`).send().expect(200)
  })
  it('should not be able to get region by id, NOT FOUND', async () => {
    const userCoordinates = [19.37121790584814, 3.189008451890416]

    const userCreated = await supertest(app)
      .post('/api/users')
      .send({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        coordinates: [userCoordinates[0], userCoordinates[1]],
      })

    const userId = userCreated.body.user._id

    await supertest(app)
      .post(`/api/regions/`)
      .send({
        name: faker.location.city(),
        polygonCoordinates: [
          [
            [17.832521396102237, 4.578700349308974],
            [17.735340563908636, 1.230748153354341],
            [22.416217314608673, 1.1821685104063278],
            [22.61057897899815, 4.740133072759676],
            [17.832521396102237, 4.578700349308974],
          ],
        ],
        userId,
      })

    await supertest(app).get(`/api/regions/1231232`).send().expect(404)
  })
})
describe('UpdateRegionController', function () {
  this.timeout(20000)

  it('should be able to update region', async () => {
    const userCoordinates = [19.37121790584814, 3.189008451890416]

    const userCreated = await supertest(app)
      .post('/api/users')
      .send({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        coordinates: [userCoordinates[0], userCoordinates[1]],
      })

    const userId = userCreated.body.user._id

    const regionCreated = await supertest(app)
      .post(`/api/regions/`)
      .send({
        name: faker.location.city(),
        polygonCoordinates: [
          [
            [17.832521396102237, 4.578700349308974],
            [17.735340563908636, 1.230748153354341],
            [22.416217314608673, 1.1821685104063278],
            [22.61057897899815, 4.740133072759676],
            [17.832521396102237, 4.578700349308974],
          ],
        ],
        userId,
      })

    const regionId = regionCreated.body.region._id

    await supertest(app)
      .put(`/api/regions/${regionId}`)
      .send({
        name: faker.person.firstName(),
        polygonCoordinates: [
          [
            [-73.97, 40.77],
            [-73.97, 40.75],
            [-73.95, 40.75],
            [-73.95, 40.77],
            [-73.97, 40.77],
          ],
        ],
      })
      .expect(204)
  })
  it('should not be able to update region, NOT FOUND', async () => {
    const userCoordinates = [19.37121790584814, 3.189008451890416]

    const userCreated = await supertest(app)
      .post('/api/users')
      .send({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        coordinates: [userCoordinates[0], userCoordinates[1]],
      })

    const userId = userCreated.body.user._id

    await supertest(app)
      .post(`/api/regions/`)
      .send({
        name: faker.location.city(),
        polygonCoordinates: [
          [
            [17.832521396102237, 4.578700349308974],
            [17.735340563908636, 1.230748153354341],
            [22.416217314608673, 1.1821685104063278],
            [22.61057897899815, 4.740133072759676],
            [17.832521396102237, 4.578700349308974],
          ],
        ],
        userId,
      })

    await supertest(app)
      .put(`/api/regions/123123`)
      .send({
        name: faker.person.firstName(),
        polygonCoordinates: [
          [
            [-73.97, 40.77],
            [-73.97, 40.75],
            [-73.95, 40.75],
            [-73.95, 40.77],
            [-73.97, 40.77],
          ],
        ],
      })
      .expect(404)
  })
})
