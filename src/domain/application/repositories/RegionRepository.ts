import { Polygon, Region } from '@/domain/enterprise/models/Region'

export interface RegionRepository {
  create(name: string, polygon: Polygon, userId: string): Promise<void>
  fetch(): Promise<Region[]>
  getById(regionId: string): Promise<Region | null>
  deleteById(regionId: string): Promise<void>
  save(region: Region): Promise<void>
  fetchByCoordinates(longitude: number, latitude: number): Promise<Region[]>
  fetchByDistance(
    longitude: number,
    latitude: number,
    maxDistance: number,
  ): Promise<Region[]>
}
