import { MongoRegionRepository } from '../../../../domain/application/repositories/mongoRepository/mongoRegionRepository'
import { CreateRegionUseCase } from '../../../../domain/application/use-cases/region/createRegion'
import { RegionRepository } from '../../../../domain/application/repositories/RegionRepository'
import { CreateRegionController } from './CreateRegionController'

const regionRepository: RegionRepository = new MongoRegionRepository()
const createRegionUseCase: CreateRegionUseCase = new CreateRegionUseCase(
  regionRepository,
)

export const createRegionController = new CreateRegionController(
  createRegionUseCase,
)
