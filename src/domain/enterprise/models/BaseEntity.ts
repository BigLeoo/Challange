import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { Prop, mongoose } from '@typegoose/typegoose'

export class BaseEntity extends TimeStamps {
  @Prop({
    required: true,
    default: () => new mongoose.Types.ObjectId().toString(),
  })
  _id: string
}
