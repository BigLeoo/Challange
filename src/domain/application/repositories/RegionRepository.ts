import { Polygon, Region } from '@/domain/enterprise/models/Region'

export interface RegionRepository {
  create(name: string, polygon: Polygon, userId: string): Promise<void>
  fetch(): Promise<Region[]>
  getById(regionId: string): Promise<Region | null>
  deleteById(regionId: string): Promise<void>
  save(region: Region): Promise<void>
}
