import type { Primitives } from '../models/hex/Primitives.ts'
import type { DomainEvent } from './DomainEvent.ts'

export abstract class DomainEventSubscriber<T extends DomainEvent> {
  abstract canHandle(primitives: unknown): primitives is Primitives<T>

  abstract cast(primitives: Primitives<T>): T

  abstract on(domainEvent: T): Promise<void>
}
