import type { interfaces } from 'inversify'
import { UseCase } from '../../shared/domain/models/hex/UseCase.ts'
import type { TalkId } from '../../shared/domain/models/ids/TalkId.ts'
import { Token } from '../../shared/domain/services/Token.ts'
import type { Talk } from '../domain/models/Talk.ts'
import type { TalkRepository } from '../domain/repositories/TalkRepository.ts'
import { TalkFinder } from '../domain/services/TalkFinder.ts'

export class GetTalk extends UseCase {
  private readonly talkFinder: TalkFinder

  public static create({ container }: interfaces.Context) {
    return new GetTalk(container.get(Token.TALK_REPOSITORY))
  }

  constructor(talkRepository: TalkRepository) {
    super()
    this.talkFinder = new TalkFinder(talkRepository)
  }

  async execute(talkId: TalkId): Promise<Talk> {
    return this.talkFinder.findOrThrowBy(talkId)
  }
}
