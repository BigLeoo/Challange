import { InMemoryRegionRepository } from '@/test/repositories/InMemoryRegionRepository'
import { expect } from 'chai'
import { randomUUID } from 'crypto'
import { Region } from '@/domain/enterprise/models/Region'
import { FetchRegionsByDistanceUseCase } from './fetchRegionByDistance'

let regionRepository: InMemoryRegionRepository
let sut: FetchRegionsByDistanceUseCase

describe('Fetch Regions By Distance Use Case', () => {
  beforeEach(() => {
    regionRepository = new InMemoryRegionRepository()
    sut = new FetchRegionsByDistanceUseCase(regionRepository)
  })

  it('should return regions within the specified distance', async () => {
    const userId = randomUUID()

    const region1: Region = {
      _id: randomUUID(),
      name: 'Nearby Region',
      user: userId,
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
      name: 'Far Away Region',
      user: userId,
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

    regionRepository.regions.push(region1, region2)

    const { regions } = await sut.execute({
      longitude: -73.9851,
      latitude: 40.7485,
      maxDistance: 10000, // 10km
    })

    expect(regions).to.have.lengthOf(1)
    expect(regions[0]).to.deep.equal(region1)
  })

  it('should return only regions belonging to the specified user', async () => {
    const user1 = randomUUID()
    const user2 = randomUUID()

    const region1: Region = {
      _id: randomUUID(),
      name: 'User 1 Region',
      user: user1,
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
      name: 'User 2 Region',
      user: user2,
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

    regionRepository.regions.push(region1, region2)

    const { regions } = await sut.execute({
      longitude: -73.9851,
      latitude: 40.7485,
      maxDistance: 10000, // 10 km
      userId: user1,
    })

    expect(regions).to.have.lengthOf(1)
    expect(regions[0]).to.deep.equal(region1)
  })

  it('should return an empty array if no regions are within the distance', async () => {
    const region1: Region = {
      _id: randomUUID(),
      name: 'Distant Region',
      user: randomUUID(),
      polygon: {
        type: 'Polygon',
        coordinates: [
          [
            [10.0, 10.0],
            [10.1, 10.1],
            [10.2, 10.2],
            [10.0, 10.0],
          ],
        ],
      },
    }

    regionRepository.regions.push(region1)

    const { regions } = await sut.execute({
      longitude: -73.9851,
      latitude: 40.7485,
      maxDistance: 5000, // 5 km
    })

    expect(regions).to.deep.equals([])
  })
})
