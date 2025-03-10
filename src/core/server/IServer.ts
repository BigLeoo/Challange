import { IRoute } from '../../infrastructure/Interfaces/IRoute'

export interface IServer {
  configureRoutes(routes: IRoute[]): void
  start(): void
}
