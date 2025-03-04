import { DomainError } from '../../../shared/domain/errors/DomainError.ts'
import { DomainErrorCode } from '../../../shared/domain/errors/DomainErrorCode.ts'
import type { EventId } from '../../../shared/domain/models/ids/EventId.ts'

export class TalkEventNotFoundError extends DomainError {
  constructor(eventId: EventId) {
    super(`Event with id ${eventId} not found`, DomainErrorCode.TALK_EVENT_NOT_FOUND)
  }
}
