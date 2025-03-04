import type { EventId } from '../../../shared/domain/models/ids/EventId.ts'
import type { TalkEvent } from '../models/TalkEvent.ts'

export interface EventRepository {
  save(event: TalkEvent): Promise<void>
  findAll(): Promise<TalkEvent[]>
  exists(id: EventId): Promise<boolean>
}
