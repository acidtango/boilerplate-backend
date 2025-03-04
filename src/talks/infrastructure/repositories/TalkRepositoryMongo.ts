import type { interfaces } from 'inversify'
import { type Collection, Db } from 'mongodb'
import type { TalkId } from '../../../shared/domain/models/ids/TalkId.ts'
import type { Closable } from '../../../shared/infrastructure/repositories/Closable.ts'
import type { Reseteable } from '../../../shared/infrastructure/repositories/Reseteable.ts'
import { Talk, type TalkPrimitives } from '../../domain/models/Talk.ts'
import type { TalkRepository } from '../../domain/repositories/TalkRepository.ts'

export class TalkRepositoryMongo implements TalkRepository, Reseteable, Closable {
  public static async create({ container }: interfaces.Context) {
    const db = await container.getAsync(Db)
    return new TalkRepositoryMongo(db)
  }

  private readonly talks: Collection<TalkPrimitives>

  constructor(db: Db) {
    this.talks = db.collection('talks')
  }

  async save(talk: Talk) {
    const primitives = talk.toPrimitives()

    await this.talks.updateOne({ id: primitives.id }, { $set: primitives }, { upsert: true })
  }

  async findBy(talkId: TalkId): Promise<Talk | undefined> {
    const talkPrimitives = await this.talks.findOne({
      id: talkId.toPrimitives(),
    })

    if (!talkPrimitives) return undefined

    return Talk.fromPrimitives(talkPrimitives)
  }

  async reset() {
    await this.talks.deleteMany()
  }

  async close(): Promise<void> {}
}
