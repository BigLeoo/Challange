import mongoose from 'mongoose'
import { IDatabase } from './IDatabase'

export class MongoDatabase implements IDatabase {
  private uri: string

  constructor(uri: string) {
    this.uri = uri
  }

  public async connect(): Promise<void> {
    try {
      console.log('🟡 Connecting to database')

      await mongoose
        .connect(this.uri)
        .then(() => console.log('🟢 Database conncected'))
    } catch (error) {
      console.log('🔴 Database connection error: ', error)
    }
  }
}
