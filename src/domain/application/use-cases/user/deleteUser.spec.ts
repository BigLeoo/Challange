import { InMemoryUserRepository } from '@/test/repositories/InMemoryUserRepository'
import { expect } from 'chai'
import { randomUUID } from 'crypto'
import { UserNotExist } from '@/core/errors/errors/UserNotExist'
import { DeleteUserUseCase } from './deleteUser'
import { User } from '@/domain/enterprise/models/User'

let userRepository: InMemoryUserRepository
let sut: DeleteUserUseCase

describe('Delete User Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    sut = new DeleteUserUseCase(userRepository)
  })

  it('should be able to delete user by id', async () => {
    const id = randomUUID()

    const user: User = {
      name: 'John Doe',
      email: 'email@email.com',
      coordinates: [123, 123],
      address: 'Rua Salomao',
      _id: id,
      regions: [randomUUID()],
    }

    userRepository.users.push(user)

    await sut.execute({ id })

    expect(userRepository.users).length(0)
  })

  it('should not be able to delete user, user not exist', async () => {
    const user: User = {
      name: 'John Doe',
      email: 'email@email.com',
      coordinates: [123, 123],
      address: 'Rua Salomao',
      _id: '1615a6fa-4519-4576-9a91-4d179a9620f6',
      regions: [randomUUID()],
    }

    userRepository.users.push(user)

    try {
      await sut.execute({ id: '57989941-51b5-483b-bac4-82fe39765c0b' })
      expect.fail('Expected UserNotExist error to be thrown')
    } catch (error) {
      expect(error).to.be.instanceOf(UserNotExist)
      expect(error.message).to.equal('User not exist.')
    }
  })
})
