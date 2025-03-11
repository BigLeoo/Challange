import { UseCaseError } from '../UseCaseError'

export class UserNotExist extends Error implements UseCaseError {
  constructor() {
    super('User not exist.')
  }
}
