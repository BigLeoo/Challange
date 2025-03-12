import { User } from '@/models'
import { UserRepository } from '../../repositories/UserRepository'

interface FetchUsersUseCaseResponse {
  users: User[]
}

export class FetchUsersUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(): Promise<FetchUsersUseCaseResponse> {
    const users = await this.userRepository.fetchUsers()

    return { users }
  }
}
