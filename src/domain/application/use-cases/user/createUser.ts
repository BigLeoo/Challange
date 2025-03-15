import { User } from '@/domain/enterprise/models/User'
import { InvalidInputCombination } from '../../../../core/errors/errors/InvalidInputCombination'
import { UserAlreadyExist } from '../../../../core/errors/errors/UserAlreadyExist'
import { GeoLibRepository } from '../../../../core/utils/IGeolib'
import { UserRepository } from '../../repositories/UserRepository'

interface CreateUserUseCaseRequest {
  name: string
  email: string
  address: string | null
  coordinates: [number, number] | null
}

interface CreateUserUseCaseResponse {
  user: User
}

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

    const userWithSameEmail = await this.userRepository.getByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExist()
    }

    if (address) {
      const coordinates =
        await this.geoLibRepository.getCoordinatesFromAddress(address)

      const user = await this.userRepository.create(
        name,
        email,
        address,
        coordinates,
      )

      return { user }
    }

    if (coordinates) {
      const address =
        await this.geoLibRepository.getAddressFromCoordinates(coordinates)

      const user = await this.userRepository.create(
        name,
        email,
        address,
        coordinates,
      )

      return { user }
    }
  }
}
