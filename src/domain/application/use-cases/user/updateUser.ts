import { InvalidInputCombination } from '@/core/errors/errors/InvalidInputCombination'

import { UserNotExist } from '@/core/errors/errors/UserNotExist'
import { EmailAlreadyExist } from '@/core/errors/errors/EmailAlreadyExist'
import { GeoLibRepository } from '@/core/utils/IGeolib'
import { UserRepository } from '../../repositories/UserRepository'

interface UpdateUserCaseRequest {
  id: string
  name?: string
  email?: string
  address?: string
  coordinates?: [number, number]
}

export class UpdateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private geoLibRepository: GeoLibRepository,
  ) {}

  async execute({
    id,
    address,
    coordinates,
    email,
    name,
  }: UpdateUserCaseRequest): Promise<void> {
    if (
      (!address && !coordinates && !email && !name) ||
      (address && coordinates)
    ) {
      throw new InvalidInputCombination()
    }

    const userWithThisEmailAlreadyExist =
      await this.userRepository.getUserByEmail(email)

    if (userWithThisEmailAlreadyExist) {
      throw new EmailAlreadyExist()
    }

    const user = await this.userRepository.getUserById(id)

    if (!user) {
      throw new UserNotExist()
    }

    if (address) {
      coordinates =
        await this.geoLibRepository.getCoordinatesFromAddress(address)
    }

    if (coordinates) {
      address =
        await this.geoLibRepository.getAddressFromCoordinates(coordinates)
    }

    user.name = name
    user.address = address
    user.coordinates = coordinates
    user.email = email

    await this.userRepository.save(user)
  }
}
