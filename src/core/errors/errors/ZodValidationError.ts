import { z } from 'zod'
import { UseCaseError } from '../UseCaseError'

export class ZodValidationError extends Error implements UseCaseError {
  public formattedErrors: { path: string; message: string }[]

  constructor(zodError: z.ZodError) {
    super('Erro de validação')

    this.formattedErrors = zodError.errors.map((err) => ({
      path: err.path.join('.'),
      message: err.message,
    }))

    this.name = 'ZodValidationError'
  }
}
