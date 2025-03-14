import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'
import { CreateUserUseCase } from '../../../../domain/application/use-cases/user/createUser'
import { UserAlreadyExist } from '../../../../core/errors/errors/UserAlreadyExist'

export class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  async handler(request: Request, response: Response): Promise<Response> {
    console.log(request.body)

    const registerBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      address: z.string().optional(),
      coordinates: z
        .array(z.number())
        .length(2)
        .transform((val) => [val[0], val[1]] as [number, number])
        .optional(),
    })

    const { name, email, address, coordinates } = registerBodySchema.parse(
      request.body,
    )

    try {
      await this.createUserUseCase.execute({
        name,
        email,
        address,
        coordinates,
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return response.status(StatusCodes.BAD_REQUEST).json({
          message: 'Erro de validação',
          errors: error.errors,
        })
      }

      if (error instanceof UserAlreadyExist) {
        return response
          .status(StatusCodes.CONFLICT)
          .send({ message: error.message })
      }

      throw error
    }

    return response.status(StatusCodes.CREATED).send()
  }
}
