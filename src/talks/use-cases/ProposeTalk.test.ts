import { beforeEach, describe, expect, it } from 'vitest'
import { EventBusFake } from '../../../test/fakes/EventBusFake.ts'
import { EventRepositoryFake } from '../../../test/fakes/EventRepositoryFake.ts'
import { SpeakerRepositoryFake } from '../../../test/fakes/SpeakerRepositoryFake.ts'
import { TalkRepositoryFake } from '../../../test/fakes/TalkRepositoryFake.ts'
import { jsdayEvent } from '../../../test/mother/EventMother/JsDay.ts'
import { nonExistingEventId } from '../../../test/mother/EventMother/NotImportant.ts'
import { conchaSpeaker } from '../../../test/mother/SpeakerMother/Concha.ts'
import { jorgeId, jorgeSpeakerWithoutProfile } from '../../../test/mother/SpeakerMother/Jorge.ts'
import { nonExistingSpeakerId } from '../../../test/mother/SpeakerMother/NotImportant.ts'
import { juniorXpId } from '../../../test/mother/TalkMother/JuniorXp.ts'
import { TalkEventNotFoundError } from '../../events/domain/errors/TalkEventNotFoundError.ts'
import type { EventRepositoryMemory } from '../../events/infrastructure/repositories/EventRepositoryMemory.ts'
import { EventId } from '../../shared/domain/models/ids/EventId.ts'
import { SpeakerId } from '../../shared/domain/models/ids/SpeakerId.ts'
import { TalkId } from '../../shared/domain/models/ids/TalkId.ts'
import { JSDAY_CANARIAS } from '../../shared/infrastructure/fixtures/events.ts'
import { CONCHA_ASENSIO } from '../../shared/infrastructure/fixtures/speakers.ts'
import { JUNIOR_XP } from '../../shared/infrastructure/fixtures/talks.ts'
import { ProfileNotFilledError } from '../../speakers/domain/errors/ProfileNotFilledError.ts'
import { SpeakerNotFoundError } from '../../speakers/domain/errors/SpeakerNotFoundError.ts'
import { TalkProposed } from '../domain/events/TalkProposed.ts'
import { TalkDescription } from '../domain/models/TalkDescription.ts'
import { TalkStatus } from '../domain/models/TalkStatus.ts'
import { TalkTitle } from '../domain/models/TalkTitle.ts'
import { ProposeTalk, type ProposeTalkParams } from './ProposeTalk.ts'

describe('ProposeTalk', () => {
  let talkRepository: TalkRepositoryFake
  let speakerRepository: SpeakerRepositoryFake
  let eventRepository: EventRepositoryMemory
  let proposeTalk: ProposeTalk
  let eventBus: EventBusFake

  beforeEach(async () => {
    talkRepository = TalkRepositoryFake.empty()
    eventRepository = EventRepositoryFake.with(jsdayEvent())
    speakerRepository = SpeakerRepositoryFake.with(conchaSpeaker(), jorgeSpeakerWithoutProfile())
    eventBus = new EventBusFake()
    proposeTalk = new ProposeTalk(eventBus, talkRepository, eventRepository, speakerRepository)
  })

  it('creates the a proposal talk', async () => {
    const params = juniorXpParams()

    await proposeTalk.execute(params)

    const talk = talkRepository.getLatestSavedTalk()
    expect(talk.hasStatus(TalkStatus.PROPOSAL)).toBe(true)
  })

  it('emits a domain event', async () => {
    const params = juniorXpParams()

    await proposeTalk.execute(params)

    eventBus.expectLastEventToBe(TalkProposed.emit(juniorXpId()))
  })

  it('fails if eventId does not exists', async () => {
    const eventId = nonExistingEventId()
    const params = juniorXpParams({ eventId })

    const result = proposeTalk.execute(params)

    await expect(result).rejects.toThrow(new TalkEventNotFoundError(eventId))
  })

  it('fails if the speaker does not have a filled profile', async () => {
    const speakerId = jorgeId()
    const params = juniorXpParams({ speakerId })

    const result = proposeTalk.execute(params)

    await expect(result).rejects.toThrow(new ProfileNotFilledError(speakerId))
  })

  it('fails if the speaker does not exists', async () => {
    const speakerId = nonExistingSpeakerId()
    const params = juniorXpParams({ speakerId })

    const result = proposeTalk.execute(params)

    await expect(result).rejects.toThrow(new SpeakerNotFoundError(speakerId))
  })
})

function juniorXpParams({
  eventId = new EventId(JSDAY_CANARIAS.id),
  speakerId = new SpeakerId(CONCHA_ASENSIO.id),
} = {}): ProposeTalkParams {
  return {
    id: new TalkId(JUNIOR_XP.id),
    title: new TalkTitle(JUNIOR_XP.title),
    description: new TalkDescription(JUNIOR_XP.description),
    cospeakers: JUNIOR_XP.cospeakers.map(SpeakerId.fromPrimitives),
    language: JUNIOR_XP.language,
    eventId: eventId,
    speakerId,
  }
}
