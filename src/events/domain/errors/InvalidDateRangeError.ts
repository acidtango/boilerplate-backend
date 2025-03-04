import { DomainError } from '../../../shared/domain/errors/DomainError.ts'
import { DomainErrorCode } from '../../../shared/domain/errors/DomainErrorCode.ts'

export class InvalidDateRangeError extends DomainError {
  constructor(startDate: Date, endDate: Date) {
    super(
      `Start date ${startDate.toISOString()} cannot be greater than ${endDate.toISOString()}`,
      DomainErrorCode.INVALID_DATE_RANGE,
    )
  }
}
