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

describe('CreateUserController', function () {
  this.timeout(10000)

  it('should be able to create user, using coordinates', async () => {
    await supertest(app)
      .post('/api/users')
      .send({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        coordinates: [faker.location.longitude(), faker.location.latitude()],
      })
      .expect(201)
  })

  it('should be able to create user, using address', async () => {
    await supertest(app)
      .post('/api/users')
      .send({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        address: 'R. Luís Delfino - Centro, Florianópolis - SC, 88015-360',
      })
      .expect(201)
  })

  it('should not able to create user, BAD REQUEST', async () => {
    await supertest(app)
      .post('/api/users')
      .send({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        address: 'R. Luís Delfino - Centro, Florianópolis - SC, 88015-360',
        coordinates: [faker.location.longitude(), faker.location.latitude()],
      })
      .expect(400)
  })

  it('should not able to create user, CONFLICT', async () => {
    const email = faker.internet.email()

    await supertest(app)
      .post('/api/users')
      .send({
        name: faker.person.fullName(),
        email,
        coordinates: [faker.location.longitude(), faker.location.latitude()],
      })

    await supertest(app)
      .post('/api/users')
      .send({
        name: faker.person.fullName(),
        email,
        coordinates: [faker.location.longitude(), faker.location.latitude()],
      })
      .expect(409)
  })
})

describe('FetchUserController', function () {
  this.timeout(10000)

  it('should be able to fetch users', async () => {
    await supertest(app)
      .post('/api/users')
      .send({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        coordinates: [faker.location.longitude(), faker.location.latitude()],
      })

    await supertest(app)
      .post('/api/users')
      .send({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        coordinates: [faker.location.longitude(), faker.location.latitude()],
      })

    const response = await supertest(app).get('/api/users').expect(200)

    expect(response.body.users).to.be.an('array')
    expect(response.body.users).length(2)
  })
})
describe('GetUserController', function () {
  this.timeout(10000)

  it('should be able to get user by id', async () => {
    const userCreated = await supertest(app)
      .post('/api/users')
      .send({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        coordinates: [faker.location.longitude(), faker.location.latitude()],
      })

    const userId = userCreated.body.user._id

    const response = await supertest(app)
      .get(`/api/users/${userId}`)
      .send()
      .expect(200)

    expect(response.body.user._id).to.be.equal(userId)
    expect(response.body.user.name).to.be.equal(userCreated.body.user.name)
    expect(response.body.user.email).to.be.equal(userCreated.body.user.email)
    expect(response.body.user.coordinates).to.deep.equal(
      userCreated.body.user.coordinates,
    )
  })
  it('should not be able to get user by id, NOT FOUND', async () => {
    await supertest(app)
      .post('/api/users')
      .send({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        coordinates: [faker.location.longitude(), faker.location.latitude()],
      })

    await supertest(app).get(`/api/users/12313`).send().expect(404)
  })
})

describe('DeleteUserController', function () {
  this.timeout(10000)

  it('should be able to delete user by id', async () => {
    const userCreated = await supertest(app)
      .post('/api/users')
      .send({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        coordinates: [faker.location.longitude(), faker.location.latitude()],
      })

    const userId = userCreated.body.user._id

    await supertest(app).delete(`/api/users/${userId}`).send().expect(204)
  })
  it('should not be able to delete user by id, NOT FOUND', async () => {
    await supertest(app)
      .post('/api/users')
      .send({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        coordinates: [faker.location.longitude(), faker.location.latitude()],
      })

    await supertest(app).delete(`/api/users/123`).send().expect(404)
  })
})

describe('UpdateUserController', function () {
  this.timeout(10000)

  it('should be able to update user, using coordinates', async () => {
    const userCreated = await supertest(app)
      .post('/api/users')
      .send({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        coordinates: [faker.location.longitude(), faker.location.latitude()],
      })

    const userId = userCreated.body.user._id

    await supertest(app)
      .put(`/api/users/${userId}`)
      .send({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        coordinates: [faker.location.longitude(), faker.location.latitude()],
      })
      .expect(200)
  })

  it('should be able to update user, using address', async () => {
    const userCreated = await supertest(app).post('/api/users').send({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      address: 'R. Luís Delfino - Centro, Florianópolis - SC, 88015-360',
    })

    const userId = userCreated.body.user._id

    await supertest(app)
      .put(`/api/users/${userId}`)
      .send({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        coordinates: [faker.location.longitude(), faker.location.latitude()],
      })
      .expect(200)
  })

  it('should not be able to update user, BAD REQUEST', async () => {
    const userCreated = await supertest(app).post('/api/users').send({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      address: 'R. Luís Delfino - Centro, Florianópolis - SC, 88015-360',
    })

    const userId = userCreated.body.user._id

    await supertest(app)
      .put(`/api/users/${userId}`)
      .send({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        address:
          'R. Eng. Agronômico Andrei Cristian Ferreira, 2-116 - Carvoeira',
        coordinates: [faker.location.longitude(), faker.location.latitude()],
      })
      .expect(400)
  })
  it('should not be able to update user, CONFLICT', async () => {
    const email = faker.internet.email()

    const userCreated = await supertest(app).post('/api/users').send({
      name: faker.person.fullName(),
      email,
      address: 'R. Luís Delfino - Centro, Florianópolis - SC, 88015-360',
    })

    const userId = userCreated.body.user._id

    await supertest(app)
      .put(`/api/users/${userId}`)
      .send({
        name: faker.person.fullName(),
        email,
        coordinates: [faker.location.longitude(), faker.location.latitude()],
      })
      .expect(409)
  })
})
