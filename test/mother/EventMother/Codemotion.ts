import { EventDateRange } from '../../../src/events/domain/models/EventDateRange.ts'
import { EventName } from '../../../src/events/domain/models/EventName.ts'
import { EventProposalsDateRange } from '../../../src/events/domain/models/EventProposalsDateRange.ts'
import { TalkEvent } from '../../../src/events/domain/models/TalkEvent.ts'
import { EventId } from '../../../src/shared/domain/models/ids/EventId.ts'
import { CODEMOTION } from '../../../src/shared/infrastructure/fixtures/events.ts'
import { flushDomainEvents } from '../Common.ts'

export function codemotionEvent() {
  const event = TalkEvent.create(
    new EventId(CODEMOTION.id),
    new EventName(CODEMOTION.name),
    new EventDateRange(CODEMOTION.startDate, CODEMOTION.endDate),
    new EventProposalsDateRange(CODEMOTION.proposalsStartDate, CODEMOTION.proposalsDeadlineDate),
  )

  return flushDomainEvents(event)
}
