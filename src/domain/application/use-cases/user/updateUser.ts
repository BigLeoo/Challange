import { InvalidInputCombination } from '@/core/errors/errors/InvalidInputCombination'
import { ResourceNotFound } from '@/core/errors/errors/ResourceNotFound'
import { EmailAlreadyExist } from '@/core/errors/errors/EmailAlreadyExist'
import { GeoLibRepository } from '@/core/utils/IGeolib'
import { UserRepository } from '../../repositories/UserRepository'

interface UpdateUserUseCaseRequest {
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
  }: UpdateUserUseCaseRequest): Promise<void> {
    if (
      (!address && !coordinates && !email && !name) ||
      (address && coordinates)
    ) {
      throw new InvalidInputCombination()
    }

    const userWithThisEmailAlreadyExist =
      await this.userRepository.getByEmail(email)

    if (userWithThisEmailAlreadyExist) {
      throw new EmailAlreadyExist()
    }

    const user = await this.userRepository.getById(id)

    if (!user) {
      throw new ResourceNotFound()
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
