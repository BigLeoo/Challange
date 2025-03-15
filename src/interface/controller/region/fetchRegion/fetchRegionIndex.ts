import { FetchRegionsUseCase } from '../../../../domain/application/use-cases/region/fetchRegion'
import { MongoRegionRepository } from '../../../../domain/application/repositories/mongoRepository/mongoRegionRepository'
import { RegionRepository } from '../../../../domain/application/repositories/RegionRepository'
import { FetchRegionsController } from './FetchRegionController'

const regionRepository: RegionRepository = new MongoRegionRepository()
const fetchRegionsUseCase: FetchRegionsUseCase = new FetchRegionsUseCase(
  regionRepository,
)

export const fetchRegionsController = new FetchRegionsController(
  fetchRegionsUseCase,
)
