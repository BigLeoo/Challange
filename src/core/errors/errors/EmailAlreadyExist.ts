import { StatusCodes } from 'http-status-codes'
import { UseCaseError } from '../UseCaseError'

export class EmailAlreadyExist extends Error implements UseCaseError {
  constructor() {
    super('Email already exist.')
  }

  statusCode(): number {
    return StatusCodes.CONFLICT
  }
}
