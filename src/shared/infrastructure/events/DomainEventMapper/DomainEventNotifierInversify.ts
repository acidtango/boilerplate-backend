import type { interfaces } from 'inversify'
import type { DomainEvent } from '../../../domain/events/DomainEvent.ts'
import type { DomainEventSubscriber } from '../../../domain/events/DomainEventSubscriber.ts'
import { Token } from '../../../domain/services/Token.ts'
import type { DomainEventNotifier } from './DomainEventNotifier.ts'

export class DomainEventNotifierInversify implements DomainEventNotifier {
  private readonly subscribers: DomainEventSubscriber<DomainEvent>[]

  public static async create({ container }: interfaces.Context) {
    return new DomainEventNotifierInversify(await container.getAllAsync(Token.SUBSCRIBER))
  }

  constructor(subscribers: DomainEventSubscriber<DomainEvent>[]) {
    this.subscribers = subscribers
  }

  async handle(primitives: unknown): Promise<void> {
    for await (const subscriber of this.subscribers) {
      if (subscriber.canHandle(primitives)) {
        const event = subscriber.cast(primitives)
        await subscriber.on(event)
      }
    }
  }
}
