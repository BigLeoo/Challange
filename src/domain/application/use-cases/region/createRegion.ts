import { RegionRepository } from '../../repositories/RegionRepository'
import { Polygon, Region } from '@/domain/enterprise/models/Region'

interface CreateRegionUseCaseRequest {
  name: string
  polygon: Polygon
  userId: string
}

interface CreateRegionUseCaseResponse {
  region: Region
}

export class CreateRegionUseCase {
  constructor(private regionRepository: RegionRepository) {}

  async execute({
    name,
    polygon,
    userId,
  }: CreateRegionUseCaseRequest): Promise<CreateRegionUseCaseResponse> {
    const region = await this.regionRepository.create(name, polygon, userId)

    return { region }
  }
}
