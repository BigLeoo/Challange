import { InMemoryUserRepository } from '@/test/repositories/InMemoryUserRepository'
import { expect } from 'chai'
import { randomUUID } from 'crypto'
import { User } from '@/models'
import { FetchUsersUseCase } from './fetchUsers'

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

    await sut.execute()

    expect(userRepository.users).length(2)
    expect(userRepository.users[0]).equals(user1)
    expect(userRepository.users[1]).equals(user2)
  })
})
