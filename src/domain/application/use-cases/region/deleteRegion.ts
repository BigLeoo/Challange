import { ResourceNotFound } from '../../../../core/errors/errors/ResourceNotFound'
import { RegionRepository } from '../../repositories/RegionRepository'

interface DeleteRegionUseCaseRequest {
  regionId: string
}

export class DeleteRegionUseCase {
  constructor(private regionRepository: RegionRepository) {}

  async execute({ regionId }: DeleteRegionUseCaseRequest): Promise<void> {
    const user = await this.regionRepository.getById(regionId)

    if (!user) {
      throw new ResourceNotFound()
    }

    await this.regionRepository.deleteById(regionId)
  }
}
