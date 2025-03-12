import { ResourceNotFound } from '@/core/errors/errors/ResourceNotFound'
import { UserRepository } from '../../repositories/UserRepository'

interface DeleteUserUseCaseRequest {
  id: string
}

export class DeleteUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({ id }: DeleteUserUseCaseRequest): Promise<void> {
    const user = await this.userRepository.getById(id)

    if (!user) {
      throw new ResourceNotFound()
    }

    await this.userRepository.delete(id)
  }
}
