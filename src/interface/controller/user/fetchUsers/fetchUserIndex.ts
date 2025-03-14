import { MongoUserRepository } from '../../../../domain/application/repositories/mongoRepository/mongoUserRepository'
import { UserRepository } from '@/domain/application/repositories/UserRepository'
import { FetchUsersUseCase } from '../../../../domain/application/use-cases/user/fetchUsers'
import { FetchUsersController } from './FetchUserController'

const userRepository: UserRepository = new MongoUserRepository()
const fetchUsersUseCase: FetchUsersUseCase = new FetchUsersUseCase(
  userRepository,
)

export const fetchUsersController = new FetchUsersController(fetchUsersUseCase)
