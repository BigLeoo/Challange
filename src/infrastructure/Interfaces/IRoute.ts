import { Router } from 'express'

export interface IRoute {
  registerRoutes(): Router
}
