import type { DomainId } from '../models/hex/DomainId.ts'
import { DomainError } from './DomainError.ts'
import { DomainErrorCode } from './DomainErrorCode.ts'

export class AggregateAlreadyCreatedError extends DomainError {
  constructor(domainId: DomainId, entityName: string) {
    super(
      `Aggregate of type ${entityName} with id ${domainId} already exists.`,
      DomainErrorCode.AGGREGATE_ALREADY_CREATED_ERROR,
    )
  }
}
