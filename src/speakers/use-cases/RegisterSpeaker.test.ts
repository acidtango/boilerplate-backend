import { beforeEach, describe, expect, it } from 'vitest'
import { EventBusFake } from '../../../test/fakes/EventBusFake.ts'
import { SpeakerRepositoryFake } from '../../../test/fakes/SpeakerRepositoryFake.ts'
import {
  conchaEmail,
  conchaId,
  conchaPassword,
  conchaSpeaker,
} from '../../../test/mother/SpeakerMother/Concha.ts'
import { jorgeEmail, jorgeId, jorgePassword } from '../../../test/mother/SpeakerMother/Jorge.ts'
import { CryptoFixed } from '../../shared/infrastructure/services/crypto/CryptoFixed.ts'
import { SpeakerAlreadyCreatedError } from '../domain/errors/SpeakerAlreadyCreatedError.ts'
import { SpeakerEmailAlreadyUsedError } from '../domain/errors/SpeakerEmailAlreadyUsedError.ts'
import { SpeakerRegistered } from '../domain/events/SpeakerRegistered.ts'
import { RegisterSpeaker, type RegisterSpeakerParams } from './RegisterSpeaker.ts'

describe('RegisterSpeaker', () => {
  let speakerRepository: SpeakerRepositoryFake
  let eventBus: EventBusFake
  let registerSpeaker: RegisterSpeaker

  beforeEach(() => {
    const crypto = new CryptoFixed()
    speakerRepository = SpeakerRepositoryFake.empty()
    eventBus = new EventBusFake()
    registerSpeaker = new RegisterSpeaker(speakerRepository, crypto, eventBus)
  })

  it('saves the speaker in the repository', async () => {
    const params = registerConchaParams()

    await registerSpeaker.execute(params)

    const speaker = speakerRepository.getLatestSavedSpeaker()
    expect(speaker.has(conchaPassword())).toBe(true)
  })

  it('emits a SpeakerRegistered event', async () => {
    const params = registerConchaParams()

    await registerSpeaker.execute(params)

    eventBus.expectLastEventToBe(new SpeakerRegistered(params.id))
  })

  it('fails if already registered', async () => {
    await speakerRepository.save(conchaSpeaker())
    const params = registerConchaParams()

    const result = registerSpeaker.execute(params)

    await expect(result).rejects.toEqual(new SpeakerEmailAlreadyUsedError(params.email))
  })

  it('fails if exists an speaker with same id', async () => {
    await speakerRepository.save(conchaSpeaker())
    const params = registerJorgeParams({ id: conchaId() })

    const result = registerSpeaker.execute(params)

    await expect(result).rejects.toEqual(new SpeakerAlreadyCreatedError(conchaId()))
  })
})

function registerConchaParams(): RegisterSpeakerParams {
  return {
    id: conchaId(),
    email: conchaEmail(),
    password: conchaPassword(),
  }
}

function registerJorgeParams({ id = jorgeId() }): RegisterSpeakerParams {
  return {
    id,
    email: jorgeEmail(),
    password: jorgePassword(),
  }
}
