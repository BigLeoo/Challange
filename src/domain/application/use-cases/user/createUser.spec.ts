import { InvalidInputCombination } from '@/core/errors/errors/InvalidInputCombination'
import { InMemoryGeoLibRepository } from '@/test/repositories/InMemoryGeoRepository'
import { InMemoryUserRepository } from '@/test/repositories/InMemoryUserRepository'
import { expect } from 'chai'
import { randomUUID } from 'crypto'
import { UserAlreadyExist } from '@/core/errors/errors/UserAlreadyExist'
import { CreateUserUseCase } from './createUser'

let userRepository: InMemoryUserRepository
let geoRepository: InMemoryGeoLibRepository
let sut: CreateUserUseCase

describe('Create User Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    geoRepository = new InMemoryGeoLibRepository()
    sut = new CreateUserUseCase(userRepository, geoRepository)
  })

  it('should be able to create user, using address', async () => {
    const userToCreate = {
      name: 'John Doe',
      email: 'email@email.com',
      coordinates: null,
      address: 'Rua Salomao',
    }

    await sut.execute(userToCreate)

    expect(userRepository.users).length(1)
    expect(userRepository.users[0].name).equal(userToCreate.name)
  })

  it('should be able to create user, using coordinates', async () => {
    const userToCreate = {
      name: 'John Doe',
      email: 'email@email.com',
      coordinates: [123, 111] as [number, number],
      address: null,
    }

    await sut.execute(userToCreate)

    expect(userRepository.users).length(1)
    expect(userRepository.users[0].name).equal(userToCreate.name)
  })

  it('should not be able to create user, Invalid input combination', async () => {
    const userToCreate = {
      name: 'John Doe',
      email: 'email@email.com',
      coordinates: [123, 111] as [number, number],
      address: 'street',
    }

    try {
      await sut.execute(userToCreate)

      expect.fail('Expected InvalidInputCombination error to be thrown')
    } catch (error) {
      expect(error).to.be.instanceOf(InvalidInputCombination)
      expect(error.message).to.equal('Invalid input combination')
    }
  })

  it('should not be able to create user, user already exist', async () => {
    userRepository.users.push({
      name: 'John Doe',
      email: 'email@email.com',
      coordinates: [123, 111] as [number, number],
      address: 'street',
      _id: randomUUID(),
      regions: [randomUUID()],
    })

    const userToCreate = {
      name: 'John Doe',
      email: 'email@email.com',
      coordinates: [123, 111] as [number, number],
      address: null,
    }

    try {
      await sut.execute(userToCreate)
      expect.fail('Expected UserAlreadyExist error to be thrown')
    } catch (error) {
      expect(error).to.be.instanceOf(UserAlreadyExist)
      expect(error.message).to.equal('User already exist.')
    }
  })
})
