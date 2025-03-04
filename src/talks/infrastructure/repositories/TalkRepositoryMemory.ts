import type { TalkId } from '../../../shared/domain/models/ids/TalkId.ts'
import type { Closable } from '../../../shared/infrastructure/repositories/Closable.ts'
import type { Reseteable } from '../../../shared/infrastructure/repositories/Reseteable.ts'
import { Talk, type TalkPrimitives } from '../../domain/models/Talk.ts'
import type { TalkRepository } from '../../domain/repositories/TalkRepository.ts'

export class TalkRepositoryMemory implements TalkRepository, Reseteable, Closable {
  public static create() {
    return new TalkRepositoryMemory()
  }

  protected talks: Map<string, TalkPrimitives> = new Map()

  async save(talk: Talk) {
    this.saveSync(talk)
  }

  protected saveSync(talk: Talk) {
    const talkPrimitives = talk.toPrimitives()

    this.talks.set(talkPrimitives.id, talkPrimitives)
  }

  async findBy(talkId: TalkId): Promise<Talk | undefined> {
    const talkPrimitives = this.talks.get(talkId.toPrimitives())

    if (!talkPrimitives) return undefined

    return Talk.fromPrimitives(talkPrimitives)
  }

  async reset() {
    this.talks.clear()
  }

  async close(): Promise<void> {}
}
