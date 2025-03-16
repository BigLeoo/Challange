import { RegionRepository } from '../../repositories/RegionRepository'
import { Region } from '@/domain/enterprise/models/Region'

interface FetchRegionsByDistanceUseCaseRequest {
  longitude: number
  latitude: number
  maxDistance: number
  userId?: string
}

interface FetchRegionsByDistanceUseCaseResponse {
  regions: Region[]
}

export class FetchRegionsByDistanceUseCase {
  constructor(private regionRepository: RegionRepository) {}

  async execute({
    longitude,
    latitude,
    maxDistance,
    userId,
  }: FetchRegionsByDistanceUseCaseRequest): Promise<FetchRegionsByDistanceUseCaseResponse> {
    const regions = await this.regionRepository.fetchByDistance(
      longitude,
      latitude,
      maxDistance,
    )

    if (userId) {
      const regionsFilteredByUserId = regions.filter((region) => {
        return region.user.toString() === userId
      })
      return { regions: regionsFilteredByUserId }
    }

    return { regions }
  }
}
