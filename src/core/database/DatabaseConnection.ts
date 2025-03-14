import { IDatabase } from './IDatabase'

export class DatabaseConnection {
  constructor(private database: IDatabase) {}

  async execute() {
    await this.database.connect()
  }
}
