import { DeleteRegionUseCase } from '../../../../domain/application/use-cases/region/deleteRegion'
import { MongoRegionRepository } from '../../../../domain/application/repositories/mongoRepository/mongoRegionRepository'
import { RegionRepository } from '../../../../domain/application/repositories/RegionRepository'
import { DeleteRegionController } from './DeleteRegionController'

const regionRepository: RegionRepository = new MongoRegionRepository()
const deleteRegionUseCase: DeleteRegionUseCase = new DeleteRegionUseCase(
  regionRepository,
)

export const deleteRegionController = new DeleteRegionController(
  deleteRegionUseCase,
)
