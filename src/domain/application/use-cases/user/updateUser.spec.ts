import { InMemoryUserRepository } from '@/test/repositories/InMemoryUserRepository'
import { expect } from 'chai'
import { randomUUID } from 'crypto'
import { InMemoryGeoLibRepository } from '@/test/repositories/InMemoryGeoRepository'
import { UserNotExist } from '@/core/errors/errors/UserNotExist'
import { InvalidInputCombination } from '@/core/errors/errors/InvalidInputCombination'
import { EmailAlreadyExist } from '@/core/errors/errors/EmailAlreadyExist'
import { UpdateUserUseCase } from './updateUser'
import { User } from '@/domain/enterprise/models/User'

let userRepository: InMemoryUserRepository
let geoLibRepository: InMemoryGeoLibRepository
let sut: UpdateUserUseCase

describe('Update User Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    geoLibRepository = new InMemoryGeoLibRepository()
    sut = new UpdateUserUseCase(userRepository, geoLibRepository)
  })

  it('should be able to update user, geting address by coordinates', async () => {
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

    const updateUser = {
      name: 'Name Update',
      email: 'emailUpdate@email.com',
      coordinates: [4444, 3333] as [number, number],
      id,
    }

    await sut.execute(updateUser)

    expect(userRepository.users[0].name).equal('Name Update')
    expect(userRepository.users[0].email).equal('emailUpdate@email.com')
    expect(userRepository.users[0].coordinates).to.deep.equal([4444, 3333])
    expect(userRepository.users[0].address).equal('Rua da Solitude')
  })

  it('should be able to update user, geting coordinates by address', async () => {
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

    const updateUser = {
      name: 'Name Update',
      email: 'emailUpdate@email.com',
      address: 'Rua da Solitude',
      id,
    }

    await sut.execute(updateUser)

    expect(userRepository.users[0].name).equal('Name Update')
    expect(userRepository.users[0].email).equal('emailUpdate@email.com')
    expect(userRepository.users[0].coordinates).to.deep.equal([4444, 3333])
    expect(userRepository.users[0].address).equal('Rua da Solitude')
  })

  it('should not be able to update user, user not exist', async () => {
    const user: User = {
      name: 'John Doe',
      email: 'email@email.com',
      coordinates: [123, 123],
      address: 'Rua Salomao',
      _id: '1615a6fa-4519-4576-9a91-4d179a9620f6',
      regions: [randomUUID()],
    }

    userRepository.users.push(user)

    const updateUser = {
      name: 'Name Update',
      email: 'emailUpdate@email.com',
      address: 'Rua da Solitude',
      id: '57989941-51b5-483b-bac4-82fe39765c0b',
    }

    try {
      await sut.execute(updateUser)
      expect.fail('Expected UserNotExist error to be thrown')
    } catch (error) {
      expect(error).to.be.instanceOf(UserNotExist)
      expect(error.message).to.equal('User not exist.')
    }
  })

  it('should not be able to update user, invalid input combination', async () => {
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

    const updateUser = {
      id,
    }

    try {
      await sut.execute(updateUser)
      expect.fail('Expected InvalidInputCombination error to be thrown')
    } catch (error) {
      expect(error).to.be.instanceOf(InvalidInputCombination)
      expect(error.message).to.equal('Invalid input combination')
    }
  })

  it('should not be able to update user, invalid input combination', async () => {
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

    const updateUser = {
      name: 'John Doe',
      email: 'email@email.com',
      coordinates: [123, 123] as [number, number],
      address: 'Rua Salomao',
      id,
    }

    try {
      await sut.execute(updateUser)
      expect.fail('Expected InvalidInputCombination error to be thrown')
    } catch (error) {
      expect(error).to.be.instanceOf(InvalidInputCombination)
      expect(error.message).to.equal('Invalid input combination')
    }
  })

  it('should not be able to update user, email already exist', async () => {
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

    const updateUser = {
      name: 'John Doe',
      email: 'email@email.com',
      address: 'Rua Salomao',
      id,
    }

    try {
      await sut.execute(updateUser)
      expect.fail('Expected InvalidInputCombination error to be thrown')
    } catch (error) {
      expect(error).to.be.instanceOf(EmailAlreadyExist)
      expect(error.message).to.equal('Email already exist.')
    }
  })
})
