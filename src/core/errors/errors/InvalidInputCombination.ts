import { UseCaseError } from '../UseCaseError'

export class InvalidInputCombination extends Error implements UseCaseError {
  constructor() {
    super('Invalid input combination')
  }
}
