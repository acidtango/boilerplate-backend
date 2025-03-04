import { EventDateRange } from '../../../src/events/domain/models/EventDateRange.ts'
import { EventName } from '../../../src/events/domain/models/EventName.ts'
import { EventProposalsDateRange } from '../../../src/events/domain/models/EventProposalsDateRange.ts'
import { TalkEvent } from '../../../src/events/domain/models/TalkEvent.ts'
import { EventId } from '../../../src/shared/domain/models/ids/EventId.ts'
import { JSDAY_CANARIAS } from '../../../src/shared/infrastructure/fixtures/events.ts'
import { flushDomainEvents } from '../Common.ts'

export function jsdayId() {
  return new EventId(JSDAY_CANARIAS.id)
}

export function jsdayEvent({ id = jsdayId() } = {}) {
  const event = TalkEvent.create(
    id,
    new EventName(JSDAY_CANARIAS.name),
    new EventDateRange(JSDAY_CANARIAS.startDate, JSDAY_CANARIAS.endDate),
    new EventProposalsDateRange(
      JSDAY_CANARIAS.proposalsStartDate,
      JSDAY_CANARIAS.proposalsDeadlineDate,
    ),
  )

  return flushDomainEvents(event)
}
