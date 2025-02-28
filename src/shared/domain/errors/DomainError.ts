import type { DomainErrorCode } from './DomainErrorCode.ts'

export class DomainError extends Error {
  public readonly code: DomainErrorCode

  constructor(message: string, code: DomainErrorCode) {
    super(message)
    this.code = code
    this.name = this.constructor.name
  }
}
