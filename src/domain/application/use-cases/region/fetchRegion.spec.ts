import { expect } from 'chai'
import { randomUUID } from 'crypto'
import { InMemoryRegionRepository } from '@/test/repositories/InMemoryRegionRepository'
import { FetchRegionsUseCase } from './fetchRegion'
import { Region } from '@/domain/enterprise/models/Region'

let regionRepository: InMemoryRegionRepository
let sut: FetchRegionsUseCase

describe('Fetch Regions Use Case', () => {
  beforeEach(() => {
    regionRepository = new InMemoryRegionRepository()
    sut = new FetchRegionsUseCase(regionRepository)
  })

  it('should be able to fetch regions', async () => {
    const region1: Region = {
      _id: randomUUID(),
      name: 'regiao 1',
      user: randomUUID(),
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

    const region2: Region = {
      _id: randomUUID(),
      name: 'regiao 2',
      user: randomUUID(),
      polygon: {
        type: 'Polygon',
        coordinates: [
          [
            [50.748817, -73.985428],
            [50.7489, -73.985],
            [50.748, -73.984],
            [50.748817, -73.985428],
          ],
        ],
      },
    }

    regionRepository.regions.push(region1, region2)

    await sut.execute()

    expect(regionRepository.regions).length(2)
    expect(regionRepository.regions[0]).equals(region1)
    expect(regionRepository.regions[1]).equals(region2)
  })
})
