import { IDatabase } from './IDatabase'

export class DatabaseConnection {
  constructor(private database: IDatabase) {}

  async execute() {
    this.database.connect()
  }
}
