import { User, UserModel } from '../../../enterprise/models/User'
import { UserRepository } from '../UserRepository'

export class MongoUserRepository implements UserRepository {
  public async create(
    name: string,
    email: string,
    address: string,
    coordinates: [number, number],
  ): Promise<User> {
    const session = await UserModel.startSession()
    try {
      session.startTransaction()
      const user = await UserModel.create({ name, email, address, coordinates })

      await session.commitTransaction()

      return user
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }

  public async getByEmail(email: string): Promise<User | null> {
    return await UserModel.findOne({ email }).lean()
  }

  public async getById(userId: string): Promise<User | null> {
    return await UserModel.findById(userId).lean()
  }

  public async delete(userId: string): Promise<void> {
    await UserModel.findByIdAndDelete(userId).lean()
    const session = await UserModel.startSession()
    try {
      session.startTransaction()
      await UserModel.findByIdAndDelete(userId).lean()
      await session.commitTransaction()
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }

  public async fetch(): Promise<User[]> {
    return await UserModel.find().lean()
  }

  public async save(user: User): Promise<void> {
    await UserModel.findByIdAndUpdate(user._id, user).lean()
    const session = await UserModel.startSession()
    try {
      session.startTransaction()
      await UserModel.findByIdAndUpdate(user._id, user).lean()
      await session.commitTransaction()
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }
}
