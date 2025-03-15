import { StatusCodes } from 'http-status-codes'
import { UseCaseError } from '../UseCaseError'

export class UserAlreadyExist extends Error implements UseCaseError {
  constructor() {
    super('User already exist.')
  }

  statusCode(): number {
    return StatusCodes.CONFLICT
  }
}
