import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'
import { ZodValidationError } from '../../../../core/errors/errors/ZodValidationError'
import { ResourceNotFound } from '../../../../core/errors/errors/ResourceNotFound'
import { FetchRegionsByDistanceUseCase } from '../../../../domain/application/use-cases/region/fetchRegionByDistance'

export class FetchRegionByDistanceController {
  constructor(
    private fetchRegionsByDistanceUseCase: FetchRegionsByDistanceUseCase,
  ) {}

  async handler(request: Request, response: Response): Promise<Response> {
    try {
      const fetchRegionByDistanceParamsSchema = z.object({
        longitude: z.coerce
          .number()
          .refine((longitude) => longitude >= -180 && longitude <= 180, {
            message: 'Longitude deve estar entre -180 e 180',
          }),
        latitude: z.coerce
          .number()
          .refine((latitude) => latitude >= -90 && latitude <= 90, {
            message: 'Latitude deve estar entre -90 e 90',
          }),
        maxDistance: z.coerce.number(),
        userId: z.string().optional(),
      })

      const { longitude, latitude, maxDistance, userId } =
        fetchRegionByDistanceParamsSchema.parse(request.params)

      const { regions } = await this.fetchRegionsByDistanceUseCase.execute({
        longitude,
        latitude,
        maxDistance,
        userId,
      })

      return response.status(StatusCodes.OK).send({ regions })
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
