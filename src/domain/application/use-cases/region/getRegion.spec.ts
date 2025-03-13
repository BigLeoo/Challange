import { InMemoryRegionRepository } from '@/test/repositories/InMemoryRegionRepository'
import { expect } from 'chai'
import { randomUUID } from 'crypto'
import { Region } from '@/domain/enterprise/models/Region'
import { GetRegionUseCase } from './getRegion'
import { ResourceNotFound } from '@/core/errors/errors/ResourceNotFound'

let regionRepository: InMemoryRegionRepository
let sut: GetRegionUseCase

describe('Get Region Use Case', () => {
  beforeEach(() => {
    regionRepository = new InMemoryRegionRepository()
    sut = new GetRegionUseCase(regionRepository)
  })

  it('should be able to get region by id', async () => {
    const id = randomUUID()

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
      _id: id,
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

    const { region } = await sut.execute({ regionId: id })

    expect(region).to.deep.equals(region2)
  })

  it('should not be able to get region, region not exist', async () => {
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

    try {
      await sut.execute({ regionId: randomUUID() })
      expect.fail('Expected ResourceNotFound error to be thrown')
    } catch (error) {
      expect(error).to.be.instanceOf(ResourceNotFound)
      expect(error.message).to.equal('Resource not found.')
    }
  })
})
