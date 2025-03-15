import { MongoRegionRepository } from '../../../../domain/application/repositories/mongoRepository/mongoRegionRepository'
import { RegionRepository } from '../../../../domain/application/repositories/RegionRepository'
import { FetchRegionByCoordinatesUseCase } from '../../../../domain/application/use-cases/region/fetchRegionsbyCoordinate'
import { FetchRegionByCoordinatesController } from './FetchRegionsByCoordinateController'

const regionRepository: RegionRepository = new MongoRegionRepository()
const fetchRegionsByCoordinatesUseCase: FetchRegionByCoordinatesUseCase =
  new FetchRegionByCoordinatesUseCase(regionRepository)

export const fetchRegionsByCoordinatesController =
  new FetchRegionByCoordinatesController(fetchRegionsByCoordinatesUseCase)
