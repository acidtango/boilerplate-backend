import type { interfaces } from 'inversify'
import type { DomainEvent } from '../../../domain/events/DomainEvent.ts'
import type { EventBus } from '../../../domain/models/hex/EventBus.ts'
import { Token } from '../../../domain/services/Token.ts'
import type { Closable } from '../../repositories/Closable.js'
import type { Reseteable } from '../../repositories/Reseteable.js'
import { sleep } from '../../utils/sleep.ts'
import type { DomainEventNotifier } from '../DomainEventMapper/DomainEventNotifier.js'

export class EventBusMemory implements EventBus, Closable, Reseteable {
  public static async create({ container }: interfaces.Context) {
    return new EventBusMemory(await container.getAsync(Token.DOMAIN_EVENT_NOTIFIER))
  }

  private readonly notifier: DomainEventNotifier

  private promises: Array<Promise<unknown>> = []

  constructor(notifier: DomainEventNotifier) {
    this.notifier = notifier
  }

  async publish(domainEvents: DomainEvent[]): Promise<void> {
    for (const domainEvent of domainEvents) {
      const promise = sleep(0).then(() => this.notifier.handle(domainEvent.toPrimitives()))
      this.promises.push(promise)
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
