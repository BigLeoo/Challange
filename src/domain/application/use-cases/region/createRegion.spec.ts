import { expect } from 'chai'
import { InMemoryRegionRepository } from '@/test/repositories/InMemoryRegionRepository'
import { randomUUID } from 'crypto'
import { CreateRegionUseCase } from './createRegion'

let regionRepository: InMemoryRegionRepository

let sut: CreateRegionUseCase

describe('Create Region Use Case', () => {
  beforeEach(() => {
    regionRepository = new InMemoryRegionRepository()
    sut = new CreateRegionUseCase(regionRepository)
  })

  it('should be able to create region', async () => {
    const regionToCreate = {
      name: 'Nova Região',
      userId: randomUUID(),
      polygon: {
        type: 'Polygon',
        coordinates: [
          [
            [40.748817, -73.985428],
            [40.7489, -73.985],
            [40.748, -73.984],
            [40.748817, -73.985428],
          ],
        ],
      },
    }

    await sut.execute(regionToCreate)

    expect(regionRepository.regions).length(1)
    expect(regionRepository.regions[0].name).equal(regionToCreate.name)
  })
})
