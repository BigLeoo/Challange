import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { FetchUsersUseCase } from '@/domain/application/use-cases/user/fetchUsers'

export class FetchUsersController {
  constructor(private fetchUserUseCase: FetchUsersUseCase) {}

  async handler(request: Request, response: Response): Promise<Response> {
    try {
      const { users } = await this.fetchUserUseCase.execute()

      return response.status(StatusCodes.OK).send({ users })
    } catch (error) {
      throw error
    }
  }
}
