import { InvalidInputCombination } from '@/core/errors/errors/InvalidInputCombination'
import { ResourceNotFound } from '@/core/errors/errors/ResourceNotFound'
import { RegionRepository } from '../../repositories/RegionRepository'
import { Polygon } from '@/domain/enterprise/models/Region'

interface UpdateRegionUseCaseRequest {
  regionId: string
  name?: string
  polygon?: Polygon
}

export class UpdateRegionUseCase {
  constructor(private regionRepository: RegionRepository) {}

  async execute({
    regionId,
    name,
    polygon,
  }: UpdateRegionUseCaseRequest): Promise<void> {
    if (!name && !polygon) {
      throw new InvalidInputCombination()
    }

    const region = await this.regionRepository.getById(regionId)

    if (!region) {
      throw new ResourceNotFound()
    }

    region.name = name
    region.polygon = polygon

    await this.regionRepository.save(region)
  }
}
