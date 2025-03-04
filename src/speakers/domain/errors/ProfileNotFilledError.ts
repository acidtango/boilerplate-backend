import { DomainError } from '../../../shared/domain/errors/DomainError.ts'
import { DomainErrorCode } from '../../../shared/domain/errors/DomainErrorCode.ts'
import type { SpeakerId } from '../../../shared/domain/models/ids/SpeakerId.ts'

export class ProfileNotFilledError extends DomainError {
  constructor(id: SpeakerId) {
    super(
      `The profile of the speaker with id ${id} is not filled`,
      DomainErrorCode.PROFILE_NOT_FILLED,
    )
  }
}
