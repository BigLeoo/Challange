import { ResourceNotFound } from '@/core/errors/errors/ResourceNotFound'
import { RegionRepository } from '../../repositories/RegionRepository'
import { Region } from '@/domain/enterprise/models/Region'

interface FetchRegionByCoordinatesUseCaseRequest {
  longitude: number
  latitude: number
}

interface FetchRegionByCoordinatesUseCaseResponse {
  regions: Region[]
}

export class FetchRegionByCoordinatesUseCase {
  constructor(private regionRepository: RegionRepository) {}

  async execute({
    longitude,
    latitude,
  }: FetchRegionByCoordinatesUseCaseRequest): Promise<FetchRegionByCoordinatesUseCaseResponse> {
    const regions = await this.regionRepository.fetchByCoordinates(
      longitude,
      latitude,
    )

    if (regions.length === 0) {
      throw new ResourceNotFound()
    }

    return { regions }
  }
}
