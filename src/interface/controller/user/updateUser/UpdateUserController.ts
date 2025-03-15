import { ResourceNotFound } from '../../../../core/errors/errors/ResourceNotFound'
import { ZodValidationError } from '../../../../core/errors/errors/ZodValidationError'
import { UpdateUserUseCase } from '../../../../domain/application/use-cases/user/updateUser'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'
import { EmailAlreadyExist } from '../../../../core/errors/errors/EmailAlreadyExist'
import { InvalidInputCombination } from '../../../../core/errors/errors/InvalidInputCombination'

export class UpdateUserController {
  constructor(private updateUserUseCase: UpdateUserUseCase) {}

  async handler(request: Request, response: Response): Promise<Response> {
    try {
      const updateUserBodySchema = z
        .object({
          name: z.string().optional(),
          email: z.string().email().optional(),
          address: z.string().optional(),
          coordinates: z
            .array(z.number())
            .length(2)
            .transform((val) => [val[0], val[1]] as [number, number])
            .refine(
              ([longitude, latitude]) =>
                latitude >= -90 &&
                latitude <= 90 &&
                longitude >= -180 &&
                longitude <= 180,
              {
                message:
                  'Longitude deve estar entre -180 e 180 e Latitude deve estar entre -90 e 90 ',
              },
            )
            .optional(),
        })
        .refine(
          (data) => Object.values(data).some((value) => value !== undefined),
          {
            message:
              'Pelo menos um dos campos (name, email, address, coordinates) deve ser informado.',
          },
        )

      const updateUserParamsSchema = z.object({
        userId: z.string(),
      })

      const { name, address, coordinates, email } = updateUserBodySchema.parse(
        request.body,
      )

      const { userId } = updateUserParamsSchema.parse(request.params)

      await this.updateUserUseCase.execute({
        id: userId,
        name,
        address,
        coordinates,
        email,
      })

      return response.status(StatusCodes.OK).send()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const zodValidationError = new ZodValidationError(error)

        return response.status(zodValidationError.statusCode()).send({
          message: zodValidationError.message,
          errors: zodValidationError.formattedErrors,
        })
      }

      if (error instanceof InvalidInputCombination) {
        return response
          .status(error.statusCode())
          .send({ message: error.message })
      }

      if (error instanceof EmailAlreadyExist) {
        return response
          .status(error.statusCode())
          .send({ message: error.message })
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
