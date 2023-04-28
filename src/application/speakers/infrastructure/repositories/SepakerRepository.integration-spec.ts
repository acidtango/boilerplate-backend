import { Test, TestingModule } from '@nestjs/testing'
import { createJoyceLinId, createJoyceLinSpeaker } from '../../../../../test/mother/SpeakerMother'
import { JOYCE_LIN } from '../../../../shared/fixtures/speakers'
import { MongoModule } from '../../../../shared/infrastructure/database/MongoModule'
import { SpeakerRepositoryMongo } from './SepakerRepositoryMongo'
import { SpeakerRepositoryMemory } from './SpeakerRepositoryMemory'
import { Reseteable } from '../../../../shared/infrastructure/repositories/Reseteable'
import { SpeakerRepository } from '../../domain/SpeakerRepository'

describe('SpeakerRepository', () => {
  describe.each([
    [SpeakerRepositoryMongo.name, SpeakerRepositoryMongo],
    [SpeakerRepositoryMemory.name, SpeakerRepositoryMemory],
  ])('%s', (name, repositoryClass) => {
    let module: TestingModule
    let speakerRepository: SpeakerRepository & Reseteable

    beforeAll(async () => {
      module = await Test.createTestingModule({
        imports: [MongoModule],
        providers: [repositoryClass],
      }).compile()

      speakerRepository = module.get(repositoryClass)
    })

    beforeEach(async () => {
      await speakerRepository.reset()
    })

    afterAll(async () => {
      await module.close()
    })

    it('saves the speaker', async () => {
      const speakerId = createJoyceLinId()
      const speaker = createJoyceLinSpeaker({ id: speakerId })

      await speakerRepository.save(speaker)

      const savedSpeaker = await speakerRepository.findById(speakerId)
      expect(savedSpeaker).toEqual(speaker)
    })

    it('checks if the speaker exists', async () => {
      const speakerId = JOYCE_LIN.id
      const speaker = createJoyceLinSpeaker({ id: speakerId })
      await speakerRepository.save(speaker)

      const exists = await speakerRepository.exists(speakerId)

      expect(exists).toBe(true)
    })
  })
})
