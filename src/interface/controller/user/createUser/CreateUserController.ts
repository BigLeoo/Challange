import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'
import { CreateUserUseCase } from '../../../../domain/application/use-cases/user/createUser'
import { UserAlreadyExist } from '../../../../core/errors/errors/UserAlreadyExist'
import { InvalidInputCombination } from '../../../../core/errors/errors/InvalidInputCombination'
import { ZodValidationError } from '../../../../core/errors/errors/ZodValidationError'

export class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  async handler(request: Request, response: Response): Promise<Response> {
    try {
      const registerBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
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

      const { name, email, address, coordinates } = registerBodySchema.parse(
        request.body,
      )

      await this.createUserUseCase.execute({
        name,
        email,
        address,
        coordinates,
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

      if (error instanceof InvalidInputCombination) {
        return response
          .status(error.statusCode())
          .send({ message: error.message })
      }

      if (error instanceof UserAlreadyExist) {
        return response
          .status(error.statusCode())
          .send({ message: error.message })
      }

      throw error
    }
  }
}
