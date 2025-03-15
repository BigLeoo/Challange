import { ResourceNotFound } from '../../../../core/errors/errors/ResourceNotFound'
import { User } from '@/domain/enterprise/models/User'
import { UserRepository } from '../../repositories/UserRepository'

interface GetUserUseCaseRequest {
  userId: string
}

interface GetUserUseCaseResponse {
  user: User
}

export class GetUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    userId,
  }: GetUserUseCaseRequest): Promise<GetUserUseCaseResponse> {
    const user = await this.userRepository.getById(userId)

    if (!user) {
      throw new ResourceNotFound()
    }

    return { user }
  }
}
