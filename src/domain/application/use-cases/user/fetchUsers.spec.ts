import { InMemoryUserRepository } from '@/test/repositories/InMemoryUserRepository'
import { expect } from 'chai'
import { randomUUID } from 'crypto'
import { FetchUsersUseCase } from './fetchUsers'
import { User } from '@/domain/enterprise/models/User'

let userRepository: InMemoryUserRepository
let sut: FetchUsersUseCase

describe('Fetch Users Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    sut = new FetchUsersUseCase(userRepository)
  })

  it('should be able to fetch users', async () => {
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

    const { users } = await sut.execute()

    expect(users).length(2)
    expect(users[0]).equals(user1)
    expect(users[1]).equals(user2)
  })
})
