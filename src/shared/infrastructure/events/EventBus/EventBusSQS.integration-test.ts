import { Container } from 'inversify'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { juniorXpId } from '../../../../../test/mother/TalkMother/JuniorXp.ts'
import { testSQSOptions } from '../../../../../test/setups/testSQSOptions.ts'
import { waitFor } from '../../../../../test/utils/waitFor.ts'
import {
  TalkProposed,
  type TalkProposedPrimitives,
} from '../../../../talks/domain/events/TalkProposed.ts'
import { DomainEventCode } from '../../../domain/events/DomainEventCode.ts'
import type { DomainEventSubscriber } from '../../../domain/events/DomainEventSubscriber.ts'
import type { Primitives } from '../../../domain/models/hex/Primitives.ts'
import { Token } from '../../../domain/services/Token.ts'
import { DomainEventNotifierInversify } from '../DomainEventMapper/DomainEventNotifierInversify.ts'
import { EventBusSQS } from './EventBusSQS.ts'

describe('EventBusSQS', () => {
  let eventBus: EventBusSQS
  let domainEventSubscriber: DomainEventSubscriberFake

  beforeAll(async () => {
    const container = new Container()
    container.bind(Token.DOMAIN_EVENT_NOTIFIER).toDynamicValue(DomainEventNotifierInversify.create)
    domainEventSubscriber = new DomainEventSubscriberFake()
    container.bind(Token.SUBSCRIBER).toConstantValue(domainEventSubscriber)
    container
      .bind<EventBusSQS>(Token.EVENT_BUS)
      .toDynamicValue(EventBusSQS.create)
      .onActivation(EventBusSQS.onActivation)
    container.bind(Token.SQS_CONFIG).toConstantValue(testSQSOptions)
    eventBus = await container.getAsync<EventBusSQS>(Token.EVENT_BUS)
  })

  beforeEach(() => {
    domainEventSubscriber.reset()
  })

  afterAll(async () => {
    await eventBus.close()
  })

  it('sends the event and calls the given subscriber', async () => {
    const event = TalkProposed.emit(juniorXpId())

    await eventBus.publish([event])

    await waitFor(async () => {
      domainEventSubscriber.expectToHaveReceivedEvent(event)
    })
  })
})

class DomainEventSubscriberFake implements DomainEventSubscriber<TalkProposed> {
  private eventReceived?: TalkProposed

  canHandle(primitives: unknown): primitives is TalkProposedPrimitives {
    return Boolean(
      typeof primitives === 'object' &&
        primitives &&
        'code' in primitives &&
        primitives.code === DomainEventCode.TALK_PROPOSED,
    )
  }

  cast(primitives: Primitives<TalkProposed>): TalkProposed {
    return TalkProposed.fromPrimitives(primitives)
  }

  async on(domainEvent: TalkProposed): Promise<void> {
    this.eventReceived = domainEvent
  }

  expectToHaveReceivedEvent(event: TalkProposed) {
    expect(this.eventReceived).toEqual(event)
  }

  reset() {
    this.eventReceived = undefined
  }
}
