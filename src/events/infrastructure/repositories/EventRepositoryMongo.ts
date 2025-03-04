import type { interfaces } from 'inversify'
import { type Collection, Db } from 'mongodb'
import type { EventId } from '../../../shared/domain/models/ids/EventId.ts'
import type { Closable } from '../../../shared/infrastructure/repositories/Closable.ts'
import type { Reseteable } from '../../../shared/infrastructure/repositories/Reseteable.ts'
import { TalkEvent, type TalkEventPrimitives } from '../../domain/models/TalkEvent.ts'
import type { EventRepository } from '../../domain/repositories/EventRepository.ts'

export class EventRepositoryMongo implements EventRepository, Reseteable, Closable {
  private readonly talkEvents: Collection<TalkEventPrimitives>

  public static async create({ container }: interfaces.Context) {
    const db = await container.getAsync(Db)
    return new EventRepositoryMongo(db)
  }

  constructor(db: Db) {
    this.talkEvents = db.collection('events')
  }

  async save(talkEvent: TalkEvent) {
    const primitives = talkEvent.toPrimitives()

    await this.talkEvents.updateOne({ id: primitives.id }, { $set: primitives }, { upsert: true })
  }

  async findAll(): Promise<TalkEvent[]> {
    const talkEventsPrimitives = await this.talkEvents.find().toArray()
    return talkEventsPrimitives.map(TalkEvent.fromPrimitives)
  }

  async exists(id: EventId): Promise<boolean> {
    return Boolean(await this.talkEvents.findOne({ id: id.toPrimitives() }))
  }

  async reset() {
    await this.talkEvents.deleteMany()
  }

  async close(): Promise<void> {}
}
