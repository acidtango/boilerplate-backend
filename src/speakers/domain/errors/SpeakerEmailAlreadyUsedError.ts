import { DomainError } from '../../../shared/domain/errors/DomainError.ts'
import { DomainErrorCode } from '../../../shared/domain/errors/DomainErrorCode.ts'
import type { EmailAddress } from '../../../shared/domain/models/EmailAddress.ts'

export class SpeakerEmailAlreadyUsedError extends DomainError {
  constructor(email: EmailAddress) {
    super(`Speaker with email ${email} already exists`, DomainErrorCode.SPEAKER_EMAIL_ALREADY_USED)
  }
}
