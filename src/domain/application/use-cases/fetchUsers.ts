import { UserRepository } from '../repositories/UserRepository'
import { User } from '@/models'

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
