import { expect } from 'chai'
import { randomUUID } from 'crypto'
import { ResourceNotFound } from '@/core/errors/errors/ResourceNotFound'
import { InMemoryUserRepository } from '@/test/repositories/InMemoryUserRepository'
import { GetUserUseCase } from './getUser'
import { User } from '@/domain/enterprise/models/User'

let userRepository: InMemoryUserRepository
let sut: GetUserUseCase

describe('Get User Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    sut = new GetUserUseCase(userRepository)
  })

  it('should be able to get user by id', async () => {
    const id = randomUUID()

    const user1: User = {
      name: 'John Doe',
      email: 'email@email.com',
      coordinates: [123, 123],
      address: 'Rua Salomao',
      _id: randomUUID(),
      regions: [randomUUID()],
    }

    const user2: User = {
      name: 'Leo',
      email: 'leo@email.com',
      coordinates: [123, 333],
      address: 'Rua Germano',
      _id: id,
      regions: [randomUUID()],
    }

    userRepository.users.push(user1, user2)

    const { user } = await sut.execute({ userId: id })

    expect(user).to.deep.equals(user2)
  })

  it('should not be able to get user, region not exist', async () => {
    const user1: User = {
      name: 'John Doe',
      email: 'email@email.com',
      coordinates: [123, 123],
      address: 'Rua Salomao',
      _id: randomUUID(),
      regions: [randomUUID()],
    }

    const user2: User = {
      name: 'Leo',
      email: 'leo@email.com',
      coordinates: [123, 333],
      address: 'Rua Germano',
      _id: randomUUID(),
      regions: [randomUUID()],
    }

    userRepository.users.push(user1, user2)

    try {
      await sut.execute({ userId: randomUUID() })
      expect.fail('Expected ResourceNotFound error to be thrown')
    } catch (error) {
      expect(error).to.be.instanceOf(ResourceNotFound)
      expect(error.message).to.equal('Resource not found.')
    }
  })
})
