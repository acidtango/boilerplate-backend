import { Injectable } from '@nestjs/common'
import { TalkRepository } from '../../domain/TalkRepository'
import { Talk, TalkPrimitives } from '../../domain/Talk'
import { Reseteable } from '../../../../shared/infrastructure/repositories/Reseteable'

@Injectable()
export class TalkRepositoryMemory implements TalkRepository, Reseteable {
  protected talks: Map<string, TalkPrimitives> = new Map()

  async save(talk: Talk) {
    this.saveSync(talk)
  }

  protected saveSync(talk: Talk) {
    const talkPrimitives = talk.toPrimitives()

    this.talks.set(talkPrimitives.id, talkPrimitives)
  }

  async findBy(talkId: string): Promise<Talk | undefined> {
    const talkPrimitives = this.talks.get(talkId)

    if (!talkPrimitives) return undefined

    return Talk.fromPrimitives(talkPrimitives)
  }

  async reset() {
    this.talks.clear()
  }
}
