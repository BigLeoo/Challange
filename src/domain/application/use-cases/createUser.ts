import { InvalidInputCombination } from '@/core/errors/errors/InvalidInputCombination'
import { UserRepository } from '../repositories/UserRepository'
import { GeoLibRepository } from '@/core/utils/IGeolib'
import { UserAlreadyExist } from '@/core/errors/errors/UserAlreadyExist'

interface CreateUserUseCaseRequest {
  name: string
  email: string
  address: string | null
  coordinates: [number, number] | null
}

interface CreateUserUseCaseResponse {}

export class CreateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private geoLibRepository: GeoLibRepository,
  ) {}

  async execute({
    name,
    email,
    address,
    coordinates,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    if (address && coordinates) {
      throw new InvalidInputCombination()
    }

    const userWithSameEmail = await this.userRepository.getUserByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExist()
    }

    if (address) {
      const coordinates =
        await this.geoLibRepository.getCoordinatesFromAddress(address)

      await this.userRepository.create(name, email, address, coordinates)
      return
    }

    if (coordinates) {
      const address =
        await this.geoLibRepository.getAddressFromCoordinates(coordinates)

      await this.userRepository.create(name, email, address, coordinates)
    }
  }
}
