import { DomainError } from '../../../shared/domain/errors/DomainError.ts'
import { DomainErrorCode } from '../../../shared/domain/errors/DomainErrorCode.ts'
import type { TalkId } from '../../../shared/domain/models/ids/TalkId.ts'

export class TalkNotFoundError extends DomainError {
  constructor(notExistentId: TalkId) {
    super(
      `Talk with id ${notExistentId.toPrimitives()} not found`,
      DomainErrorCode.TALK_DOES_NOT_EXISTS,
    )
  }
}
