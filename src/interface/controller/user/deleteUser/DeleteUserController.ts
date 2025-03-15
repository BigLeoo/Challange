import { ResourceNotFound } from '../../../../core/errors/errors/ResourceNotFound'
import { ZodValidationError } from '../../../../core/errors/errors/ZodValidationError'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'
import { DeleteUserUseCase } from '../../../../domain/application/use-cases/user/deleteUser'

export class DeleteUserController {
  constructor(private deleteUserUseCase: DeleteUserUseCase) {}

  async handler(request: Request, response: Response): Promise<Response> {
    try {
      const deleteUserParamsSchema = z.object({
        userId: z.string(),
      })

      const { userId } = deleteUserParamsSchema.parse(request.params)

      await this.deleteUserUseCase.execute({ id: userId })

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

      throw error
    }
  }
}
