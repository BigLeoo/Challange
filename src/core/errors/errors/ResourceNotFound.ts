import { StatusCodes } from 'http-status-codes'
import { UseCaseError } from '../UseCaseError'

export class ResourceNotFound extends Error implements UseCaseError {
  constructor() {
    super('Resource not found.')
  }

  public statusCode() {
    return StatusCodes.NOT_FOUND
  }
}
