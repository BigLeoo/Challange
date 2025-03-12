import { InMemoryRegionRepository } from '@/test/repositories/InMemoryRegionRepository'
import { expect } from 'chai'
import { randomUUID } from 'crypto'
import { ResourceNotFound } from '@/core/errors/errors/ResourceNotFound'
import { InvalidInputCombination } from '@/core/errors/errors/InvalidInputCombination'
import { UpdateRegionUseCase } from './updateRegion'
import { Region } from '@/domain/enterprise/models/Region'

let regionRepository: InMemoryRegionRepository
let sut: UpdateRegionUseCase

describe('Update Region Use Case', () => {
  beforeEach(() => {
    regionRepository = new InMemoryRegionRepository()
    sut = new UpdateRegionUseCase(regionRepository)
  })

  it('should be able to update region', async () => {
    const id = randomUUID()

    const region: Region = {
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

    regionRepository.regions.push(region)

    const updateRegion = {
      name: 'Name Update',
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
      regionId: id,
    }

    await sut.execute(updateRegion)

    expect(regionRepository.regions[0].name).equal('Name Update')
    expect(regionRepository.regions[0].polygon).to.deep.equal({
      type: 'Polygon',
      coordinates: [
        [
          [50.748817, -73.985428],
          [50.7489, -73.985],
          [50.748, -73.984],
          [50.748817, -73.985428],
        ],
      ],
    })
  })

  it('should not be able to update region, region not exist', async () => {
    const region: Region = {
      _id: 'f12e59ba-dcbd-42c3-aa31-88ee15d9210d',
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

    regionRepository.regions.push(region)

    const updateRegion = {
      name: 'Name Update',
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
      regionId: 'a99a5135-a4b8-4c44-b043-7f30633133a3',
    }

    try {
      await sut.execute(updateRegion)
      expect.fail('Expected ResourceNotExist error to be thrown')
    } catch (error) {
      expect(error).to.be.instanceOf(ResourceNotFound)
      expect(error.message).to.equal('Resource not found.')
    }
  })

  it('should not be able to update region, invalid input combination', async () => {
    const id = randomUUID()

    const region: Region = {
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

    regionRepository.regions.push(region)

    const updateUser = {
      regionId: id,
    }

    try {
      await sut.execute(updateUser)
      expect.fail('Expected InvalidInputCombination error to be thrown')
    } catch (error) {
      expect(error).to.be.instanceOf(InvalidInputCombination)
      expect(error.message).to.equal('Invalid input combination')
    }
  })
})
