import {
  prop,
  pre,
  getModelForClass,
  Ref,
  modelOptions,
} from '@typegoose/typegoose'
import * as mongoose from 'mongoose'
import ObjectId = mongoose.Types.ObjectId

import { BaseEntity } from './BaseEntity'
import { User, UserModel } from './User'

@pre<Region>('save', async function (next) {
  const region = this as Omit<any, keyof Region> & Region

  if (!region._id) region._id = new ObjectId().toString()

  if (region.isNew) {
    const user = await UserModel.findOne({ _id: region.user })
    user.regions.push(region._id)
    await user.save({ session: region.$session() })
  }
  next(region.validateSync())
})
@modelOptions({ schemaOptions: { validateBeforeSave: false } })
export class Region extends BaseEntity {
  @prop({ required: true })
  name!: string

  @prop({ ref: () => User, required: true })
  user: Ref<User>
}

export const RegionModel = getModelForClass(Region)
