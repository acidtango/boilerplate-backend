import type { interfaces } from 'inversify'
import { UseCase } from '../../shared/domain/models/hex/UseCase.ts'
import type { TalkId } from '../../shared/domain/models/ids/TalkId.ts'
import { Token } from '../../shared/domain/services/Token.ts'
import type { TalkRepository } from '../domain/repositories/TalkRepository.ts'
import { TalkFinder } from '../domain/services/TalkFinder.ts'

export class ApproveTalk extends UseCase {
  private readonly talkFinder: TalkFinder

  private readonly talkRepository: TalkRepository

  public static create({ container }: interfaces.Context) {
    return new ApproveTalk(container.get(Token.TALK_REPOSITORY))
  }

  constructor(talkRepository: TalkRepository) {
    super()
    this.talkRepository = talkRepository
    this.talkFinder = new TalkFinder(talkRepository)
  }

  async execute(talkId: TalkId) {
    const talk = await this.talkFinder.findOrThrowBy(talkId)

    talk.approve()

    await this.talkRepository.save(talk)
  }
}
