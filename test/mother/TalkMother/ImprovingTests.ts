import { EventId } from '../../../src/shared/domain/models/ids/EventId.ts'
import { SpeakerId } from '../../../src/shared/domain/models/ids/SpeakerId.ts'
import { TalkId } from '../../../src/shared/domain/models/ids/TalkId.ts'
import { IMPROVING_TESTS } from '../../../src/shared/infrastructure/fixtures/talks.ts'
import { Talk } from '../../../src/talks/domain/models/Talk.ts'
import { TalkDescription } from '../../../src/talks/domain/models/TalkDescription.ts'
import { TalkTitle } from '../../../src/talks/domain/models/TalkTitle.ts'
import { flushDomainEvents } from '../Common.ts'

export function improvingTestsId() {
  return new TalkId(IMPROVING_TESTS.id)
}

export function improvingTestsTalk({ id = improvingTestsId() } = {}) {
  const talk = Talk.proposal(
    id,
    new TalkTitle(IMPROVING_TESTS.title),
    new TalkDescription(IMPROVING_TESTS.description),
    IMPROVING_TESTS.language,
    [],
    new SpeakerId(IMPROVING_TESTS.id),
    new EventId(IMPROVING_TESTS.id),
  )

  return flushDomainEvents(talk)
}
