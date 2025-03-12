import { RegionRepository } from '../../repositories/RegionRepository'
import { Region } from '@/domain/enterprise/models/Region'

interface FetchRegionUseCaseResponse {
  regions: Region[]
}

export class FetchRegionsUseCase {
  constructor(private regionRepository: RegionRepository) {}

  async execute(): Promise<FetchRegionUseCaseResponse> {
    const regions = await this.regionRepository.fetch()

    return { regions }
  }
}
