import { RegionRepository } from '@/domain/application/repositories/RegionRepository'
import { Polygon, Region } from '@/domain/enterprise/models/Region'
import { randomUUID } from 'crypto'

export class InMemoryRegionRepository implements RegionRepository {
  public regions: Region[] = []

  async create(name: string, polygon: Polygon, userId: string): Promise<void> {
    const regionToCreate: Region = {
      name,
      polygon,
      _id: randomUUID(),
      user: userId,
    }

    await this.regions.push(regionToCreate)
  }

  async fetch(): Promise<Region[]> {
    return this.regions
  }

  async deleteById(regionId: string): Promise<void> {
    const regionsFiltered = await this.regions.filter((region) => {
      return region._id !== regionId
    })

    this.regions = regionsFiltered
  }

  async getById(regionId: string): Promise<Region | null> {
    const region = await this.regions.find((region) => {
      return region._id === regionId
    })

    return region
  }

  async save(region: Region): Promise<void> {
    const itemIndex = this.regions.findIndex((item) => {
      return item._id === region._id
    })

    this.regions[itemIndex] = region
  }
}
