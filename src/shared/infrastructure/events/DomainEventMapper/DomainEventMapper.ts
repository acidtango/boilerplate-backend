import type { DomainEvent, DomainEventClass } from '../../../domain/events/DomainEvent.ts'
import type { DomainEventCode } from '../../../domain/events/DomainEventCode.ts'
import type { DomainEventSubscriber } from '../../../domain/events/DomainEventSubscriber.ts'

export type SubscribersAndEvent = {
  subscribers: Array<DomainEventSubscriber<DomainEvent>>
  eventClass: DomainEventClass
}

export interface DomainEventMapper {
  getSubscribersAndEvent(code: DomainEventCode): SubscribersAndEvent | undefined
}
