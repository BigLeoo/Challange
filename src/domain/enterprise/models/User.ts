import { prop, pre, getModelForClass, Ref } from '@typegoose/typegoose'
import { BaseEntity } from './BaseEntity'
import { Region } from './Region'
import { geoLib } from '../../../core/utils/Geolib'

@pre<User>('save', async function (next) {
  const user = this as Omit<any, keyof User> & User
  if (user.isModified('coordinates') && !user.isNew) {
    user.address = await geoLib.getAddressFromCoordinates(user.coordinates)
  } else if (user.isModified('address') && !user.isNew) {
    const response = await geoLib.getCoordinatesFromAddress(user.address)
    user.coordinates = [response[0], response[1]]
  }
  next()
})
export class User extends BaseEntity {
  @prop({ required: true })
  name!: string

  @prop({ required: true })
  email!: string

  @prop({ required: true })
  address: string

  @prop({ required: true, type: () => [Number] })
  coordinates: [number, number]

  @prop({ required: true, default: [], ref: 'Region' })
  regions: Ref<Region>[]
}

export const UserModel = getModelForClass(User)
