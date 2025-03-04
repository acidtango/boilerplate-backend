import { BindingScopeEnum, Container } from 'inversify'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { juniorXpId, juniorXpTalk } from '../../../../test/mother/TalkMother/JuniorXp.ts'
import { testMongoOptions } from '../../../../test/setups/testMongoOptions.ts'
import { container as prodContainer } from '../../../container.ts'
import { Token } from '../../../shared/domain/services/Token.ts'
import type { Closable } from '../../../shared/infrastructure/repositories/Closable.ts'
import { mongoModule } from '../../../shared/infrastructure/repositories/CreateMongoClient.ts'
import type { Reseteable } from '../../../shared/infrastructure/repositories/Reseteable.ts'
import type { TalkRepository } from '../../domain/repositories/TalkRepository.ts'
import { TalkRepositoryMemory } from './TalkRepositoryMemory.ts'
import { TalkRepositoryMongo } from './TalkRepositoryMongo.ts'

describe('TalkRepository', () => {
  const container = new Container({ defaultScope: BindingScopeEnum.Singleton })
  container.bind(TalkRepositoryMemory).toDynamicValue(TalkRepositoryMemory.create)
  container.bind(TalkRepositoryMongo).toDynamicValue(TalkRepositoryMongo.create)
  container.load(mongoModule)
  prodContainer.rebind(Token.DB_CONFIG).toConstantValue(testMongoOptions)

  describe.each([
    [TalkRepositoryMemory.name, TalkRepositoryMemory],
    [TalkRepositoryMongo.name, TalkRepositoryMongo],
  ])('%s', (name, repositoryClass) => {
    let talkRepository: TalkRepository & Reseteable & Closable

    beforeAll(async () => {
      talkRepository = await container.getAsync(repositoryClass)
    })

    beforeEach(async () => {
      await talkRepository.reset()
    })

    afterAll(async () => {
      await talkRepository.close()
    })

    it('saves the talk', async () => {
      const talkId = juniorXpId()
      const talk = juniorXpTalk({ id: talkId })

      await talkRepository.save(talk)

      const savedTalk = await talkRepository.findBy(talkId)
      expect(savedTalk).toEqual(talk)
    })

    it('findById returns undefined if not found', async () => {
      const notExistentId = juniorXpId()

      const notExistentTalk = await talkRepository.findBy(notExistentId)

      expect(notExistentTalk).toBeUndefined()
    })
  })
})
