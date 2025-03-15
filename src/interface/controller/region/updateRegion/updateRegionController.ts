import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'
import { ZodValidationError } from '../../../../core/errors/errors/ZodValidationError'
import { UpdateRegionUseCase } from '../../../../domain/application/use-cases/region/updateRegion'
import { ResourceNotFound } from '../../../../core/errors/errors/ResourceNotFound'
import { InvalidInputCombination } from '../../../../core/errors/errors/InvalidInputCombination'

export class UpdateRegionController {
  constructor(private updateRegionUseCase: UpdateRegionUseCase) {}

  async handler(request: Request, response: Response): Promise<Response> {
    try {
      const updateRegionBodySchema = z
        .object({
          name: z.string().optional(),
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
            )
            .optional(),
          userId: z.string().optional(),
        })
        .refine(
          (data) => Object.values(data).some((value) => value !== undefined),
          {
            message:
              'Pelo menos um dos campos (name, polygonCoordinates, userId ) deve ser informado.',
          },
        )

      const updateRegionParamsSchema = z.object({
        regionId: z.string(),
      })

      const { name, polygonCoordinates, userId } = updateRegionBodySchema.parse(
        request.body,
      )

      const { regionId } = updateRegionParamsSchema.parse(request.params)

      if (polygonCoordinates) {
        const polygon = {
          type: 'Polygon',
          coordinates: polygonCoordinates as number[][][],
        }

        await this.updateRegionUseCase.execute({
          name,
          polygon,
          regionId,
          userId,
        })
      }

      await this.updateRegionUseCase.execute({
        name,
        regionId,
        userId,
      })

      return response.status(StatusCodes.NO_CONTENT).send()
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

      if (error instanceof InvalidInputCombination) {
        return response
          .status(error.statusCode())
          .send({ message: error.message })
      }

      throw error
    }
  }
}
