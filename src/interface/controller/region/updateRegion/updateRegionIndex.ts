import { MongoRegionRepository } from '../../../../domain/application/repositories/mongoRepository/mongoRegionRepository'
import { RegionRepository } from '../../../../domain/application/repositories/RegionRepository'
import { UpdateRegionUseCase } from '../../../../domain/application/use-cases/region/updateRegion'
import { UpdateRegionController } from './updateRegionController'

const regionRepository: RegionRepository = new MongoRegionRepository()
const updateRegionUseCase: UpdateRegionUseCase = new UpdateRegionUseCase(
  regionRepository,
)

export const updateRegionController = new UpdateRegionController(
  updateRegionUseCase,
)
