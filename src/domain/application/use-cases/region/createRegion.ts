import { RegionRepository } from '../../repositories/RegionRepository'
import { Polygon } from '@/domain/enterprise/models/Region'

interface CreateRegionUseCaseRequest {
  name: string
  polygon: Polygon
  userId: string
}

export class CreateRegionUseCase {
  constructor(private regionRepository: RegionRepository) {}

  async execute({
    name,
    polygon,
    userId,
  }: CreateRegionUseCaseRequest): Promise<void> {
    await this.regionRepository.create(name, polygon, userId)
  }
}
