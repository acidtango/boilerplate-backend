import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { juniorXpId } from '../../../../../test/mother/TalkMother/JuniorXp.ts'
import { testSQSOptions } from '../../../../../test/setups/testSQSOptions.ts'
import { waitFor } from '../../../../../test/utils/waitFor.ts'
import { TalkProposed } from '../../../../talks/domain/events/TalkProposed.ts'
import type { DomainEvent } from '../../../domain/events/DomainEvent.js'
import type { DomainEventSubscriber } from '../../../domain/events/DomainEventSubscriber.ts'
import { DomainEventMapperFake } from '../DomainEventMapper/DomainEventMapperFake.ts'
import { EventBusSQS } from './EventBusSQS.ts'

describe('EventBusSQS', () => {
  let eventBus: EventBusSQS
  let domainEventSubscriber: DomainEventSubscriberFake

  beforeAll(async () => {
    domainEventSubscriber = new DomainEventSubscriberFake()
    const domainEventMapper = new DomainEventMapperFake(domainEventSubscriber)
    eventBus = new EventBusSQS(testSQSOptions, domainEventMapper)
    await eventBus.initialize()
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

  canHandle(domainEvent: DomainEvent): boolean {
    return domainEvent instanceof TalkProposed
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
