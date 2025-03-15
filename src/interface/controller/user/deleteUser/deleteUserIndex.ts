import { MongoUserRepository } from '../../../../domain/application/repositories/mongoRepository/mongoUserRepository'
import { UserRepository } from '@/domain/application/repositories/UserRepository'
import { DeleteUserUseCase } from '../../../../domain/application/use-cases/user/deleteUser'
import { DeleteUserController } from './DeleteUserController'

const userRepository: UserRepository = new MongoUserRepository()
const deleteUserUseCase: DeleteUserUseCase = new DeleteUserUseCase(
  userRepository,
)

export const deleteUserController = new DeleteUserController(deleteUserUseCase)
