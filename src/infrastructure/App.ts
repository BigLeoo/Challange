import { DatabaseConnection } from '../core/database/DatabaseConnection'
import { IServer } from '../core/server/IServer'

export class App {
  private databaseConnection: DatabaseConnection
  private server: IServer

  constructor(databaseConnection: DatabaseConnection, server: IServer) {
    this.databaseConnection = databaseConnection
    this.server = server
  }

  public async start() {
    try {
      await this.databaseConnection.execute()

      await this.server.start()
    } catch (error) {
      console.log('Failed to start application: ', error)
    }
  }
}
