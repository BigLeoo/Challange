import { Router } from 'express'

export interface IServer {
  configureRoutes(routes: Router[]): void
  start(): void
}
