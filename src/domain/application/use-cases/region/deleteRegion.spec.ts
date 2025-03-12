import { expect } from 'chai'
import { randomUUID } from 'crypto'
import { ResourceNotFound } from '@/core/errors/errors/ResourceNotFound'
import { InMemoryRegionRepository } from '@/test/repositories/InMemoryRegionRepository'
import { DeleteRegionUseCase } from './deleteRegion'
import { Region } from '@/domain/enterprise/models/Region'

let regionRepository: InMemoryRegionRepository
let sut: DeleteRegionUseCase

describe('Delete Region Use Case', () => {
  beforeEach(() => {
    regionRepository = new InMemoryRegionRepository()
    sut = new DeleteRegionUseCase(regionRepository)
  })

  it('should be able to delete region by id', async () => {
    const id = randomUUID()

    const region1: Region = {
      _id: id,
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

    await sut.execute({ regionId: id })

    expect(regionRepository.regions).length(1)
  })

  it('should not be able to delete region, region not exist', async () => {
    const region: Region = {
      _id: 'f12e59ba-dcbd-42c3-aa31-88ee15d9210d',
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

    regionRepository.regions.push(region)

    try {
      await sut.execute({ regionId: '57989941-51b5-483b-bac4-82fe39765c0b' })
      expect.fail('Expected UserNotExist error to be thrown')
    } catch (error) {
      expect(error).to.be.instanceOf(ResourceNotFound)
      expect(error.message).to.equal('Resource not found.')
    }
  })
})
