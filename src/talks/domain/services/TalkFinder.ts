import { DomainService } from '../../../shared/domain/models/hex/DomainService.ts'
import type { TalkId } from '../../../shared/domain/models/ids/TalkId.ts'
import { TalkNotFoundError } from '../errors/TalkNotFoundError.ts'
import type { TalkRepository } from '../repositories/TalkRepository.ts'

export class TalkFinder extends DomainService {
  private readonly talkRepository: TalkRepository

  constructor(talkRepository: TalkRepository) {
    super()
    this.talkRepository = talkRepository
  }

  async findOrThrowBy(talkId: TalkId) {
    const talk = await this.talkRepository.findBy(talkId)

    if (!talk) {
      throw new TalkNotFoundError(talkId)
    }

    return talk
  }
}
