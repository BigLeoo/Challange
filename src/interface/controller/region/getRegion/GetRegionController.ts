import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'
import { ZodValidationError } from '../../../../core/errors/errors/ZodValidationError'
import { GetRegionUseCase } from '../../../../domain/application/use-cases/region/getRegion'
import { ResourceNotFound } from '../../../../core/errors/errors/ResourceNotFound'

export class GetRegionController {
  constructor(private getRegionUseCase: GetRegionUseCase) {}

  async handler(request: Request, response: Response): Promise<Response> {
    try {
      const getRegionParamsSchema = z.object({
        regionId: z.string(),
      })

      const { regionId } = getRegionParamsSchema.parse(request.params)

      const { region } = await this.getRegionUseCase.execute({
        regionId,
      })

      return response.status(StatusCodes.OK).send({ region })
    } catch (error) {
      if (error instanceof z.ZodError) {
        const zodValidationError = new ZodValidationError(error)

        return response.status(zodValidationError.statusCode()).send({
          message: zodValidationError.message,
          errors: zodValidationError.formattedErrors,
        })
      }

      if (error instanceof ResourceNotFound) {
        return response
          .status(error.statusCode())
          .send({ message: error.message })
      }

      throw error
    }
  }
}
