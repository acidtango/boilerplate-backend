import { DomainError } from '../../../shared/domain/errors/DomainError.ts'
import { DomainErrorCode } from '../../../shared/domain/errors/DomainErrorCode.ts'
import type { SpeakerId } from '../../../shared/domain/models/ids/SpeakerId.ts'

export class SpeakerNotFoundError extends DomainError {
  constructor(notExistentId: SpeakerId) {
    super(
      `Speaker with id ${notExistentId.toPrimitives()} not found`,
      DomainErrorCode.SPEAKER_DOES_NOT_EXISTS,
    )
  }
}
