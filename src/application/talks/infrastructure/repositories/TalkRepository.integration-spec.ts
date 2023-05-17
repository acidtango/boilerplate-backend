import { Test, TestingModule } from '@nestjs/testing'
import { createApiTalk, createApiTalkId } from '../../../../../test/mother/TalkMother'
import { TalkRepositoryMongo } from './TalkRepositoryMongo'
import { MongoModule } from '../../../../shared/infrastructure/database/MongoModule'
import { TalkRepositoryMemory } from './TalkRepositoryMemory'
import { Reseteable } from '../../../../shared/infrastructure/repositories/Reseteable'
import { TalkRepository } from '../../domain/TalkRepository'

describe('TalkRepository', () => {
  describe.each([
    [TalkRepositoryMongo.name, TalkRepositoryMongo],
    [TalkRepositoryMemory.name, TalkRepositoryMemory],
  ])('%s', (name, repositoryClass) => {
    let module: TestingModule
    let talkRepository: TalkRepository & Reseteable

    beforeAll(async () => {
      module = await Test.createTestingModule({
        imports: [MongoModule],
        providers: [repositoryClass],
      }).compile()

      talkRepository = module.get(repositoryClass)
    })

    beforeEach(async () => {
      await talkRepository.reset()
    })

    afterAll(async () => {
      await module.close()
    })

    it('saves the talk', async () => {
      const talkId = createApiTalkId()
      const talk = createApiTalk({ id: talkId })

      await talkRepository.save(talk)

      const savedTalk = await talkRepository.findBy(talkId)
      expect(savedTalk).toEqual(talk)
    })

    it('findById returns undefined if not found', async () => {
      const notExistentId = createApiTalkId()

      const notExistentTalk = await talkRepository.findBy(notExistentId)

      expect(notExistentTalk).toBeUndefined()
    })
  })
})
