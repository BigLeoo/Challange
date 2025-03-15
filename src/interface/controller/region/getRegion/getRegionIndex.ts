import { MongoRegionRepository } from '../../../../domain/application/repositories/mongoRepository/mongoRegionRepository'
import { RegionRepository } from '../../../../domain/application/repositories/RegionRepository'
import { GetRegionUseCase } from '../../../../domain/application/use-cases/region/getRegion'
import { GetRegionController } from './GetRegionController'

const regionRepository: RegionRepository = new MongoRegionRepository()
const getRegionUseCase: GetRegionUseCase = new GetRegionUseCase(
  regionRepository,
)

export const getRegionController = new GetRegionController(getRegionUseCase)
