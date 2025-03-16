import { Polygon, Region, RegionModel } from '../../../enterprise/models/Region'
import { RegionRepository } from '../RegionRepository'

export class MongoRegionRepository implements RegionRepository {
  public async create(
    name: string,
    polygon: Polygon,
    userId: string,
  ): Promise<Region> {
    const session = await RegionModel.startSession()
    try {
      session.startTransaction()
      const region = await RegionModel.create({ name, polygon, user: userId })
      await session.commitTransaction()
      return region
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }

  public async fetch(): Promise<Region[]> {
    return await RegionModel.find().lean()
  }

  public async getById(regionId: string): Promise<Region | null> {
    return await RegionModel.findById(regionId).lean()
  }

  public async deleteById(regionId: string): Promise<void> {
    await RegionModel.findByIdAndDelete(regionId).lean()
    const session = await RegionModel.startSession()
    try {
      session.startTransaction()
      await RegionModel.findByIdAndDelete(regionId).lean()
      await session.commitTransaction()
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }

  public async save(region: Region): Promise<void> {
    await RegionModel.findByIdAndUpdate(region._id, region).lean()
    const session = await RegionModel.startSession()
    try {
      session.startTransaction()
      await RegionModel.findByIdAndUpdate(region._id, region).lean()
      await session.commitTransaction()
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }

  public async fetchByCoordinates(
    longitude: number,
    latitude: number,
  ): Promise<Region[]> {
    return await RegionModel.find({
      polygon: {
        $geoIntersects: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
        },
      },
    }).lean()
  }

  public async fetchByDistance(
    longitude: number,
    latitude: number,
    maxDistance: number,
  ): Promise<Region[]> {
    return await RegionModel.find({
      polygon: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: maxDistance,
        },
      },
    })
  }
}
