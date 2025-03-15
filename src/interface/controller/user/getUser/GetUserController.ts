import { ResourceNotFound } from '../../../../core/errors/errors/ResourceNotFound'
import { ZodValidationError } from '../../../../core/errors/errors//ZodValidationError'
import { GetUserUseCase } from '../../../../domain/application/use-cases/user/getUser'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'

export class GetUserController {
  constructor(private getUserUseCase: GetUserUseCase) {}

  async handler(request: Request, response: Response): Promise<Response> {
    try {
      const getUserParamsSchema = z.object({
        userId: z.string(),
      })

      const { userId } = getUserParamsSchema.parse(request.params)

      const { user } = await this.getUserUseCase.execute({ userId })

      return response.status(StatusCodes.OK).send({ user })
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
