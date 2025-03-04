import { BindingScopeEnum, Container } from 'inversify'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import {
  conchaEmail,
  conchaId,
  conchaSpeaker,
} from '../../../../test/mother/SpeakerMother/Concha.ts'
import { testMongoOptions } from '../../../../test/setups/testMongoOptions.ts'
import { SpeakerId } from '../../../shared/domain/models/ids/SpeakerId.ts'
import { Token } from '../../../shared/domain/services/Token.ts'
import { CONCHA_ASENSIO } from '../../../shared/infrastructure/fixtures/speakers.ts'
import type { Closable } from '../../../shared/infrastructure/repositories/Closable.ts'
import { mongoModule } from '../../../shared/infrastructure/repositories/CreateMongoClient.ts'
import type { Reseteable } from '../../../shared/infrastructure/repositories/Reseteable.ts'
import type { SpeakerRepository } from '../../domain/repositories/SpeakerRepository.ts'
import { SpeakerRepositoryMongo } from './SepakerRepositoryMongo.ts'
import { SpeakerRepositoryMemory } from './SpeakerRepositoryMemory.ts'

describe('SpeakerRepository', () => {
  const container = new Container({ defaultScope: BindingScopeEnum.Singleton })
  container.bind(SpeakerRepositoryMemory).toDynamicValue(SpeakerRepositoryMemory.create)
  container.bind(SpeakerRepositoryMongo).toDynamicValue(SpeakerRepositoryMongo.create)
  container.load(mongoModule)
  container.rebind(Token.DB_CONFIG).toConstantValue(testMongoOptions)

  describe.each([
    { repositoryClass: SpeakerRepositoryMemory },
    { repositoryClass: SpeakerRepositoryMongo },
  ])('$repositoryClass.name', ({ repositoryClass }) => {
    let speakerRepository: SpeakerRepository & Reseteable & Closable

    beforeAll(async () => {
      speakerRepository = await container.getAsync(repositoryClass)
    })

    beforeEach(async () => {
      await speakerRepository.reset()
    })

    afterAll(async () => {
      await speakerRepository.close()
    })

    it('saves the speaker', async () => {
      const speakerId = conchaId()
      const speaker = conchaSpeaker({ id: speakerId })

      await speakerRepository.save(speaker)

      const savedSpeaker = await speakerRepository.findById(speakerId)
      expect(savedSpeaker).toEqual(speaker)
    })

    it('checks if the speaker exists', async () => {
      const speakerId = new SpeakerId(CONCHA_ASENSIO.id)
      const speaker = conchaSpeaker({ id: speakerId })
      await speakerRepository.save(speaker)

      const exists = await speakerRepository.exists(speakerId)

      expect(exists).toBe(true)
    })

    describe('findBy email', () => {
      it('returns undefined if does not exists', async () => {
        const email = conchaEmail()

        const speaker = await speakerRepository.findBy(email)

        expect(speaker).toBeUndefined()
      })

      it('returns the speaker if exists', async () => {
        const email = conchaEmail()
        const speaker = conchaSpeaker({ email })
        await speakerRepository.save(speaker)

        const savedSpeaker = await speakerRepository.findBy(email)

        expect(savedSpeaker).toEqual(speaker)
      })
    })

    describe('existsWith', () => {
      it('returns false if does not exists', async () => {
        const email = conchaEmail()

        const exists = await speakerRepository.existsWith(email)

        expect(exists).toBe(false)
      })

      it('checks if the speaker with an email already exists', async () => {
        const email = conchaEmail()
        const speaker = conchaSpeaker({ email })
        await speakerRepository.save(speaker)

        const exists = await speakerRepository.existsWith(email)

        expect(exists).toBe(true)
      })
    })
  })
})
