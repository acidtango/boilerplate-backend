import type { DomainEvent } from '../../events/DomainEvent.ts'

export interface EventBus {
  publish(domainEvents: DomainEvent[]): Promise<void>
}
