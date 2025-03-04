import { EventId } from '../../../src/shared/domain/models/ids/EventId.ts'
import { OrganizerId } from '../../../src/shared/domain/models/ids/OrganizerId.ts'
import { SpeakerId } from '../../../src/shared/domain/models/ids/SpeakerId.ts'
import { TalkId } from '../../../src/shared/domain/models/ids/TalkId.ts'
import { JSDAY_CANARIAS } from '../../../src/shared/infrastructure/fixtures/events.ts'
import { DAILOS } from '../../../src/shared/infrastructure/fixtures/organizers.ts'
import { CONCHA_ASENSIO } from '../../../src/shared/infrastructure/fixtures/speakers.ts'
import { JUNIOR_XP } from '../../../src/shared/infrastructure/fixtures/talks.ts'
import { Talk } from '../../../src/talks/domain/models/Talk.ts'
import { TalkDescription } from '../../../src/talks/domain/models/TalkDescription.ts'
import { TalkTitle } from '../../../src/talks/domain/models/TalkTitle.ts'
import { flushDomainEvents } from '../Common.ts'

export function juniorXpId() {
  return new TalkId(JUNIOR_XP.id)
}

export function juniorXpTalk({ id = juniorXpId(), cospeakers = JUNIOR_XP.cospeakers } = {}) {
  const talk = Talk.proposal(
    id,
    new TalkTitle(JUNIOR_XP.title),
    new TalkDescription(JUNIOR_XP.description),
    JUNIOR_XP.language,
    cospeakers.map(SpeakerId.fromPrimitives),
    new SpeakerId(CONCHA_ASENSIO.id),
    new EventId(JSDAY_CANARIAS.id),
  )

  return flushDomainEvents(talk)
}

export function juniorXpTalkReviewed() {
  const talk = juniorXpTalk()
  talk.assignForReviewTo(new OrganizerId(DAILOS.id))
  return flushDomainEvents(talk)
}
