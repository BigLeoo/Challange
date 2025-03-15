import { FetchRegionsByDistanceUseCase } from '../../../../domain/application/use-cases/region/fetchRegionByDistance'
import { MongoRegionRepository } from '../../../../domain/application/repositories/mongoRepository/mongoRegionRepository'
import { RegionRepository } from '../../../../domain/application/repositories/RegionRepository'
import { FetchRegionByDistanceController } from './FetchRegionsByDistanceController'

const regionRepository: RegionRepository = new MongoRegionRepository()
const fetchRegionsByDistanceUseCase: FetchRegionsByDistanceUseCase =
  new FetchRegionsByDistanceUseCase(regionRepository)

export const fetchRegionsByDistanceController =
  new FetchRegionByDistanceController(fetchRegionsByDistanceUseCase)
