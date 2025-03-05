import type { interfaces } from 'inversify'
import type { DomainEvent, DomainEventPrimitives } from '../../../domain/events/DomainEvent.ts'
import type { EventBus } from '../../../domain/models/hex/EventBus.ts'
import { Token } from '../../../domain/services/Token.ts'
import type { Closable } from '../../repositories/Closable.js'
import type { Reseteable } from '../../repositories/Reseteable.js'
import { sleep } from '../../utils/sleep.ts'
import type { DomainEventMapper } from '../DomainEventMapper/DomainEventMapper.ts'

export class EventBusMemory implements EventBus, Closable, Reseteable {
  public static async create({ container }: interfaces.Context) {
    return new EventBusMemory(await container.getAsync(Token.DOMAIN_EVENT_MAPPER))
  }

  private readonly domainEventMapper: DomainEventMapper

  private promises: Array<Promise<unknown>> = []

  constructor(domainEventMapper: DomainEventMapper) {
    this.domainEventMapper = domainEventMapper
  }

  async publish(domainEvents: DomainEvent[]): Promise<void> {
    for (const domainEvent of domainEvents) {
      const promise = sleep(0).then(() => this.handle(domainEvent.toPrimitives()))
      this.promises.push(promise)
    }
  }

  async handle(event: DomainEventPrimitives) {
    const subscribersAndEvent = this.domainEventMapper.getSubscribersAndEvent(event.code)

    if (!subscribersAndEvent) {
      return
    }

    const { subscribers, eventClass } = subscribersAndEvent

    for await (const subscriber of subscribers) {
      const domainEvent = eventClass.fromPrimitives(event)
      await subscriber.on(domainEvent)
    }
  }

  waitForEvents() {
    return Promise.all(this.promises)
  }

  async reset(): Promise<void> {
    await this.waitForEvents()
  }

  async close(): Promise<void> {
    await this.reset()
  }
}
