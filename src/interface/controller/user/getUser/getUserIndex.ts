import { MongoUserRepository } from '../../../../domain/application/repositories/mongoRepository/mongoUserRepository'
import { UserRepository } from '@/domain/application/repositories/UserRepository'

import { GetUserController } from './GetUserController'
import { GetUserUseCase } from '../../../../domain/application/use-cases/user/getUser'

const userRepository: UserRepository = new MongoUserRepository()
const getUserUseCase: GetUserUseCase = new GetUserUseCase(userRepository)

export const getUserController = new GetUserController(getUserUseCase)
