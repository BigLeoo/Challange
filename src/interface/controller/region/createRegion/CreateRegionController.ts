import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'
import { ZodValidationError } from '../../../../core/errors/errors/ZodValidationError'
import { CreateRegionUseCase } from '../../../../domain/application/use-cases/region/createRegion'

export class CreateRegionController {
  constructor(private createRegionUseCase: CreateRegionUseCase) {}

  async handler(request: Request, response: Response): Promise<Response> {
    try {
      const createRegionBodySchema = z.object({
        name: z.string(),
        polygonCoordinates: z
          .array(
            z.array(z.tuple([z.number(), z.number()])).min(4), // Cada anel deve ter pelo menos 4 pontos
          )
          .min(1) // Deve ter pelo menos um anel
          .refine(
            (rings) =>
              rings.every((ring) => {
                const first = ring[0]
                const last = ring[ring.length - 1]
                return first[0] === last[0] && first[1] === last[1]
              }),
            {
              message:
                'O primeiro e o último ponto de cada anel devem ser iguais.',
            },
          ),
        userId: z.string(),
      })

      const { name, polygonCoordinates, userId } = createRegionBodySchema.parse(
        request.body,
      )

      const polygon = {
        type: 'Polygon',
        coordinates: polygonCoordinates as number[][][],
      }

      await this.createRegionUseCase.execute({
        name,
        polygon,
        userId,
      })

      return response.status(StatusCodes.CREATED).send()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const zodValidationError = new ZodValidationError(error)

        return response.status(zodValidationError.statusCode()).send({
          message: zodValidationError.message,
          errors: zodValidationError.formattedErrors,
        })
      }

      throw error
    }
  }
}
