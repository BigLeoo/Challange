import { MongoUserRepository } from '../../../../domain/application/repositories/mongoRepository/mongoUserRepository'
import { UserRepository } from '@/domain/application/repositories/UserRepository'
import { UpdateUserUseCase } from '../../../../domain/application/use-cases/user/updateUser'
import { GeoLibRepository } from '../../../../core/utils/IGeolib'
import { GeoLib } from '../../../../core/utils/Geolib'
import { UpdateUserController } from './UpdateUserController'

const userRepository: UserRepository = new MongoUserRepository()
const geoLibRepository: GeoLibRepository = new GeoLib()
const updateUserUseCase: UpdateUserUseCase = new UpdateUserUseCase(
  userRepository,
  geoLibRepository,
)

export const updateUserController = new UpdateUserController(updateUserUseCase)
