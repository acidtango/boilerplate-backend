import { DomainError } from '../../../shared/domain/errors/DomainError.ts'
import { DomainErrorCode } from '../../../shared/domain/errors/DomainErrorCode.ts'
import type { TalkId } from '../../../shared/domain/models/ids/TalkId.ts'

export class TalkCannotBeApprovedError extends DomainError {
  constructor(talkId: TalkId) {
    super(`Talk ${talkId} can not be approved`, DomainErrorCode.TALK_CANNOT_BE_APPROVED)
  }
}
