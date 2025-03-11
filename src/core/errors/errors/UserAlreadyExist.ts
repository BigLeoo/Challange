import { UseCaseError } from '../UseCaseError'

export class UserAlreadyExist extends Error implements UseCaseError {
  constructor() {
    super('User already exist.')
  }
}
