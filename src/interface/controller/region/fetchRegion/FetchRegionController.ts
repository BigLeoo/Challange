import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { FetchRegionsUseCase } from '../../../../domain/application/use-cases/region/fetchRegion'

export class FetchRegionsController {
  constructor(private fetchRegionUseCase: FetchRegionsUseCase) {}

  async handler(request: Request, response: Response): Promise<Response> {
    try {
      const { regions } = await this.fetchRegionUseCase.execute()

      return response.status(StatusCodes.OK).send({ regions })
    } catch (error) {}
  }
}
