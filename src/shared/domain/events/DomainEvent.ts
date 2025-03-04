import { UuidGeneratorRandom } from '../../infrastructure/services/uuid-generator/UuidGeneratorRandom.ts'
import { DomainId } from '../models/hex/DomainId.ts'
import type { Primitives } from '../models/hex/Primitives.ts'
import type { DomainEventCode } from './DomainEventCode.ts'

export type DomainEventPrimitives = Primitives<DomainEvent> & Record<string, unknown>

export abstract class DomainEvent {
  static toPrimitives(e: DomainEvent) {
    return {
      code: e.code,
      eventId: e.eventId.toPrimitives(),
      occurredAt: e.occurredAt,
    }
  }

  public readonly code: DomainEventCode

  public readonly eventId: DomainId

  public readonly occurredAt: Date

  protected constructor(
    code: DomainEventCode,
    eventId: DomainId = new DomainId(UuidGeneratorRandom.generate()),
    occurredAt: Date = new Date(),
  ) {
    this.occurredAt = occurredAt
    this.eventId = eventId
    this.code = code
  }

  toPrimitives() {
    return DomainEvent.toPrimitives(this)
  }
}

export type DomainEventClass = {
  code: DomainEventCode
  // biome-ignore lint/suspicious/noExplicitAny: We don't know the type of the argument
  fromPrimitives: (primitives: any) => DomainEvent
}
