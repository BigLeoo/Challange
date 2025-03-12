import { UseCaseError } from '../UseCaseError'

export class ResourceNotFound extends Error implements UseCaseError {
  constructor() {
    super('Resource not found.')
  }
}
