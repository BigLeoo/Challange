import { ResourceNotFound } from '../../../../core/errors/errors/ResourceNotFound'
import { RegionRepository } from '../../repositories/RegionRepository'
import { Region } from '@/domain/enterprise/models/Region'

interface GetRegionUseCaseRequest {
  regionId: string
}

interface GetRegionUseCaseResponse {
  region: Region
}

export class GetRegionUseCase {
  constructor(private regionRepository: RegionRepository) {}

  async execute({
    regionId,
  }: GetRegionUseCaseRequest): Promise<GetRegionUseCaseResponse> {
    const region = await this.regionRepository.getById(regionId)

    if (!region) {
      throw new ResourceNotFound()
    }

    return { region }
  }
}
