import { TalkRepositoryFake } from '../../../../test/fakes/TalkRepositoryFake'
import { CODEMOTION } from '../../../shared/fixtures/events'
import { JOYCE_LIN } from '../../../shared/fixtures/speakers'
import { API_TALK } from '../../../shared/fixtures/talks'
import { EventId } from '../../../shared/domain/ids/EventId'
import { SpeakerId } from '../../../shared/domain/ids/SpeakerId'
import { TalkDescription } from '../domain/TalkDescription'
import { TalkId } from '../../../shared/domain/ids/TalkId'
import { TalkStatus } from '../domain/TalkStatus'
import { CreateTalk, CreateTalkParams } from './CreateTalk'
import { EventRepositoryMemory } from '../../events/infrastructure/repositories/EventRepositoryMemory'
import { createCodemotionEvent } from '../../../../test/mother/TalkEventMother'
import { TalkEventNotFoundError } from '../../events/domain/errors/TalkEventNotFoundError'

describe('CreateTalk', () => {
  it('creates the a proposal talk', async () => {
    const talkRepository = TalkRepositoryFake.empty()
    const eventRepository = new EventRepositoryMemory()
    await eventRepository.save(createCodemotionEvent())
    const createTalk = new CreateTalk(talkRepository, eventRepository)
    const params = generateCreateApiTalkParams()

    await createTalk.execute(params)

    const talk = talkRepository.getLatestSavedTalk()
    expect(talk.hasStatus(TalkStatus.PROPOSAL)).toBe(true)
  })

  it('fails if eventId does not exists', async () => {
    const talkRepository = TalkRepositoryFake.empty()
    const eventRepository = new EventRepositoryMemory()
    const createTalk = new CreateTalk(talkRepository, eventRepository)
    const params = generateCreateApiTalkParams()

    await expect(createTalk.execute(params)).rejects.toThrow(
      new TalkEventNotFoundError(new EventId(CODEMOTION.id))
    )
  })
})

function generateCreateApiTalkParams(): CreateTalkParams {
  return {
    id: new TalkId(API_TALK.id),
    title: API_TALK.title,
    description: new TalkDescription(API_TALK.description),
    cospeakers: API_TALK.cospeakers.map(SpeakerId.fromPrimitives),
    language: API_TALK.language,
    eventId: new EventId(CODEMOTION.id),
    speakerId: new SpeakerId(JOYCE_LIN.id),
  }
}
