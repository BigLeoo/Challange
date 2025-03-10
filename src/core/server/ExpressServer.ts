import express, { Application } from 'express'
import { IServer } from './IServer'
import { IRoute } from '../../infrastructure/Interfaces/IRoute'

export class ExpressServer implements IServer {
  private app: Application
  private port: number

  constructor(port: number) {
    this.app = express()
    this.port = port
    this.middleware()
  }

  private middleware(): void {
    this.app.use(express.json())
  }

  public configureRoutes(routes: IRoute[]): void {
    routes.forEach((route) => {
      this.app.use('/api', route.registerRoutes())
    })
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`Server is running on http://localhost:${this.port}`)
    })
  }
}
