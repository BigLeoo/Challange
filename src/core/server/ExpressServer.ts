import express, { Application, Router } from 'express'
import { IServer } from './IServer'

export class ExpressServer implements IServer {
  private app: Application
  private port: number

  constructor(port: number, routes: Router[]) {
    this.app = express()
    this.port = port
    this.middleware()
    this.configureRoutes(routes)
  }

  private middleware(): void {
    this.app.use(express.json())
  }

  public configureRoutes(routes: Router[]): void {
    routes.forEach((route) => {
      this.app.use('/api', route)
    })
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`🚀 Server is running on http://localhost:${this.port}/api`)
    })
  }
}
