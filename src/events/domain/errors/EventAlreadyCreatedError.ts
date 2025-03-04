import { AggregateAlreadyCreatedError } from '../../../shared/domain/errors/AggregateAlreadyCreatedError.ts'
import type { EventId } from '../../../shared/domain/models/ids/EventId.ts'
import { TalkEvent } from '../models/TalkEvent.ts'

export class EventAlreadyCreatedError extends AggregateAlreadyCreatedError {
  constructor(domainId: EventId) {
    super(domainId, TalkEvent.name)
  }
}
