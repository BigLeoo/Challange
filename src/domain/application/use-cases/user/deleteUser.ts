import { UserNotExist } from '@/core/errors/errors/UserNotExist'
import { UserRepository } from '../../repositories/UserRepository'

interface DeleteUserUseCaseRequest {
  id: string
}

export class DeleteUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({ id }: DeleteUserUseCaseRequest): Promise<void> {
    const user = await this.userRepository.getUserById(id)

    if (!user) {
      throw new UserNotExist()
    }

    await this.userRepository.delete(id)
  }
}
