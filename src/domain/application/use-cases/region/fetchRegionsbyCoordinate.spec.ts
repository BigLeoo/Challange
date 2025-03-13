import { InMemoryRegionRepository } from '@/test/repositories/InMemoryRegionRepository'
import { expect } from 'chai'
import { randomUUID } from 'crypto'
import { Region } from '@/domain/enterprise/models/Region'
import { ResourceNotFound } from '@/core/errors/errors/ResourceNotFound'
import { FetchRegionByCoordinatesUseCase } from './fetchRegionsbyCoordinate'

let regionRepository: InMemoryRegionRepository
let sut: FetchRegionByCoordinatesUseCase

describe('Fetch Region By Coordinates Use Case', () => {
  beforeEach(() => {
    regionRepository = new InMemoryRegionRepository()
    sut = new FetchRegionByCoordinatesUseCase(regionRepository)
  })

  it('should be able to get region by coordinates', async () => {
    const region1: Region = {
      _id: randomUUID(),
      name: 'Região 1',
      user: randomUUID(),
      polygon: {
        type: 'Polygon',
        coordinates: [
          [
            [-73.985428, 40.748817],
            [-73.985, 40.7489],
            [-73.984, 40.748],
            [-73.985428, 40.748817],
          ],
        ],
      },
    }

    const region2: Region = {
      _id: randomUUID(),
      name: 'Região 2',
      user: randomUUID(),
      polygon: {
        type: 'Polygon',
        coordinates: [
          [
            [17.365438807099395, -1.1511546060132645],
            [21.254616928361912, -1.2984382603762583],
            [21.225153457746558, 1.9567835857482834],
            [17.33597533648404, 1.9567835857482834],
            [17.365438807099395, -1.1511546060132645],
          ],
        ],
      },
    }

    const region3: Region = {
      _id: randomUUID(),
      name: 'Região 2',
      user: randomUUID(),
      polygon: {
        type: 'Polygon',
        coordinates: [
          [
            [18.21987945495283, 1.544488416651916],
            [18.205147719644685, -0.606146547384796],
            [20.78320139851212, -0.6798005808554279],
            [20.768469663203973, 1.5003088120583072],
            [18.21987945495283, 1.544488416651916],
          ],
        ],
      },
    }

    regionRepository.regions.push(region1, region2, region3)

    const { regions } = await sut.execute({
      longitude: 19.53100389734786,
      latitude: 0.5429093751211695,
    })

    expect(regions[0]).to.deep.equals(region2)
    expect(regions[1]).to.deep.equals(region3)
  })

  it('should not be able to get region when no region contains the coordinates', async () => {
    const region1: Region = {
      _id: randomUUID(),
      name: 'Região 1',
      user: randomUUID(),
      polygon: {
        type: 'Polygon',
        coordinates: [
          [
            [19.310027867731122, -2.9177783479807147],
            [22.048214364607702, -5.214752681602036],
            [24.083110107462403, -3.197282592909218],
            [19.310027867731122, -2.9177783479807147],
          ],
        ],
      },
    }

    const region2: Region = {
      _id: randomUUID(),
      name: 'Região 2',
      user: randomUUID(),
      polygon: {
        type: 'Polygon',
        coordinates: [
          [
            [16.820364600710747, 4.075093913286963],
            [17.203389718713424, 1.3824922423280412],
            [22.374228811755557, 1.5592147487008248],
            [22.344765341140203, 4.2073333330540095],
            [16.820364600710747, 4.075093913286963],
          ],
        ],
      },
    }

    regionRepository.regions.push(region1, region2)

    try {
      await sut.execute({
        longitude: 19.53100389734786,
        latitude: 0.5429093751211695,
      })
      expect.fail('Expected ResourceNotFound error to be thrown')
    } catch (error) {
      expect(error).to.be.instanceOf(ResourceNotFound)
      expect(error.message).to.equal('Resource not found.')
    }
  })
})
