export interface UseCaseError {
  message: string
  statusCode(): number
}
