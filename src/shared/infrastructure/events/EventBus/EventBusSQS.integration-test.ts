import { Container } from 'inversify'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { testSQSOptions } from '../../../../../test/setups/testSQSOptions.ts'
import { waitFor } from '../../../../../test/utils/waitFor.ts'
import { DomainEvent } from '../../../domain/events/DomainEvent.js'
import { DomainEventCode } from '../../../domain/events/DomainEventCode.ts'
import type { DomainEventSubscriber } from '../../../domain/events/DomainEventSubscriber.ts'
import { DomainId } from '../../../domain/models/hex/DomainId.js'
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
    const event = SomethingHappened.emit('e7882d3e-b476-49a8-914e-4b421a58ed30')

    await eventBus.publish([event])

    await waitFor(async () => {
      domainEventSubscriber.expectToHaveReceivedEvent(event)
    })
  })
})

class DomainEventSubscriberFake implements DomainEventSubscriber<SomethingHappened> {
  private eventReceived?: SomethingHappened

  canHandle(primitives: unknown): primitives is SomethingHappenedPrimitives {
    return Boolean(
      typeof primitives === 'object' &&
        primitives &&
        'code' in primitives &&
        primitives.code === DomainEventCode.SOMETHING_HAPPENED,
    )
  }

  cast(primitives: Primitives<SomethingHappened>): SomethingHappened {
    return SomethingHappened.fromPrimitives(primitives)
  }

  async on(domainEvent: SomethingHappened): Promise<void> {
    this.eventReceived = domainEvent
  }

  expectToHaveReceivedEvent(event: SomethingHappened) {
    expect(this.eventReceived).toEqual(event)
  }

  reset() {
    this.eventReceived = undefined
  }
}

type SomethingHappenedPrimitives = Primitives<SomethingHappened>

class SomethingHappened extends DomainEvent {
  public static readonly code = DomainEventCode.SOMETHING_HAPPENED

  public readonly id: string

  public static fromPrimitives(primitives: SomethingHappenedPrimitives) {
    return new SomethingHappened(
      primitives.id,
      new DomainId(primitives.eventId),
      new Date(primitives.occurredAt),
    )
  }

  public static emit(id: string) {
    return new SomethingHappened(id)
  }

  private constructor(id: string, eventId?: DomainId, occurredAt?: Date) {
    super(DomainEventCode.SOMETHING_HAPPENED, eventId, occurredAt)
    this.id = id
  }

  toPrimitives() {
    const commonPrimitives = DomainEvent.toPrimitives(this)

    return {
      ...commonPrimitives,
      id: this.id,
    }
  }
}
