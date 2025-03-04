import { describe, expect, it } from 'vitest'
import { EventRepositoryFake } from '../../../test/fakes/EventRepositoryFake.ts'
import { jsdayEvent } from '../../../test/mother/EventMother/JsDay.ts'
import type { EventRepository } from '../domain/repositories/EventRepository.ts'
import { ListEvents } from './ListEvents.ts'

describe('ListEvents', () => {
  it('returns all the events', async () => {
    const event = jsdayEvent()
    const eventRepository: EventRepository = EventRepositoryFake.with(event)
    const listEvents = new ListEvents(eventRepository)

    const talkEvents = await listEvents.execute()

    expect(talkEvents).toEqual([event])
  })
})
