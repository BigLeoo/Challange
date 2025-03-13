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

  async fetchByCoordinates(
    longitude: number,
    latitude: number,
  ): Promise<Region[]> {
    const matchingRegions: Region[] = []

    for (const region of this.regions) {
      if (
        this.isPointInsidePolygon(
          longitude,
          latitude,
          region.polygon.coordinates[0],
        )
      ) {
        matchingRegions.push(region)
      }
    }

    return matchingRegions
  }

  async fetchByDistance(
    longitude: number,
    latitude: number,
    maxDistance: number,
  ): Promise<Region[]> {
    return this.regions.filter((region) => {
      const centroid = this.calculateCentroid(region.polygon.coordinates[0])
      const distance = this.haversineDistance(
        latitude,
        longitude,
        centroid[1],
        centroid[0],
      )
      return distance <= maxDistance
    })
  }

  private isPointInsidePolygon(
    lng: number,
    lat: number,
    polygon: number[][],
  ): boolean {
    let inside = false
    const n = polygon.length

    for (let i = 0, j = n - 1; i < n; j = i++) {
      const [xi, yi] = polygon[i] // longitude, latitude
      const [xj, yj] = polygon[j] // longitude, latitude

      const intersect =
        yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi

      if (intersect) inside = !inside
    }

    return inside
  }

  private calculateCentroid(polygon: number[][]): [number, number] {
    let sumX = 0
    let sumY = 0
    polygon.forEach(([lng, lat]) => {
      sumX += lng
      sumY += lat
    })
    return [sumX / polygon.length, sumY / polygon.length]
  }

  private haversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const toRad = (angle: number) => (angle * Math.PI) / 180
    const R = 6371 // Earth radius in km
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c // Distance in km
  }
}
