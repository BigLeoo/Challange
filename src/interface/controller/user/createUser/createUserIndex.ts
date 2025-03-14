import { GeoLibRepository } from '@/core/utils/IGeolib'
import { GeoLib } from '../../../../core/utils/Geolib'
import { MongoUserRepository } from '../../../../domain/application/repositories/mongoRepository/mongoUserRepository'
import { UserRepository } from '@/domain/application/repositories/UserRepository'
import { CreateUserUseCase } from '../../../../domain/application/use-cases/user/createUser'
import { CreateUserController } from './CreateUserController'

const userRepository: UserRepository = new MongoUserRepository()
const geoRepository: GeoLibRepository = new GeoLib()
const createUserUseCase: CreateUserUseCase = new CreateUserUseCase(
  userRepository,
  geoRepository,
)

export const createUserController = new CreateUserController(createUserUseCase)
