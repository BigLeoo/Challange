import { StatusCodes } from 'http-status-codes'
import { UseCaseError } from '../UseCaseError'

export class InvalidInputCombination extends Error implements UseCaseError {
  constructor() {
    super('Invalid input combination')
  }

  statusCode(): number {
    return StatusCodes.BAD_REQUEST
  }
}
