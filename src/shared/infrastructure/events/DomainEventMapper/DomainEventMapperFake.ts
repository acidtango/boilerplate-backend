import type { interfaces } from 'inversify'
import { TalkProposed } from '../../../../talks/domain/events/TalkProposed.ts'
import { TalkProposedSubscriber } from '../../../../talks/use-cases/subscribers/TalkProposedSubscriber.ts'
import type { DomainEvent } from '../../../domain/events/DomainEvent.ts'
import { DomainEventCode } from '../../../domain/events/DomainEventCode.ts'
import type { DomainEventSubscriber } from '../../../domain/events/DomainEventSubscriber.ts'
import type { DomainEventMapper, SubscribersAndEvent } from './DomainEventMapper.ts'

export class DomainEventMapperFake implements DomainEventMapper {
  private readonly subscriber: DomainEventSubscriber<DomainEvent>

  public static async create({ container }: interfaces.Context) {
    return new DomainEventMapperFake(await container.getAsync(TalkProposedSubscriber))
  }

  constructor(subscriber: DomainEventSubscriber<DomainEvent>) {
    this.subscriber = subscriber
  }

  getSubscribersAndEvent(code: DomainEventCode): SubscribersAndEvent | undefined {
    if (code !== DomainEventCode.TALK_PROPOSED) {
      return
    }

    return {
      subscribers: [this.subscriber],
      eventClass: TalkProposed,
    }
  }
}
