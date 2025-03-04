import type { EventId } from '../../../shared/domain/models/ids/EventId.ts'
import type { Closable } from '../../../shared/infrastructure/repositories/Closable.ts'
import type { Reseteable } from '../../../shared/infrastructure/repositories/Reseteable.ts'
import { TalkEvent, type TalkEventPrimitives } from '../../domain/models/TalkEvent.ts'
import type { EventRepository } from '../../domain/repositories/EventRepository.ts'

export class EventRepositoryMemory implements EventRepository, Reseteable, Closable {
  private readonly talkEvents: Map<string, TalkEventPrimitives> = new Map()

  public static create() {
    return new EventRepositoryMemory()
  }

  async save(talkEvent: TalkEvent): Promise<void> {
    this.saveSync(talkEvent)
  }

  async findAll(): Promise<TalkEvent[]> {
    const talkEventsPrimitives = [...this.talkEvents.values()]

    return talkEventsPrimitives.map(TalkEvent.fromPrimitives)
  }

  async exists(id: EventId): Promise<boolean> {
    return this.talkEvents.has(id.toPrimitives())
  }

  async reset() {
    this.talkEvents.clear()
  }

  async close(): Promise<void> {}

  protected saveSync(talkEvent: TalkEvent) {
    const talkEventPrimitives = talkEvent.toPrimitives()

    this.talkEvents.set(talkEventPrimitives.id, talkEventPrimitives)
  }
}
