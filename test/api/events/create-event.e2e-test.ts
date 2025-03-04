import { describe, expect, it } from 'vitest'
import { JSDAY_CANARIAS } from '../../../src/shared/infrastructure/fixtures/events.ts'
import { createClient } from '../../utils/TestClient.ts'

describe('create event', () => {
  it('can be created', async () => {
    const client = await createClient()

    const { status } = await client.createEvent()

    expect(status).toEqual(201)
    const { body: events } = await client.getEvents()
    expect(events).toHaveLength(1)
    const firstEvent = events[0]
    expect(firstEvent.id).toEqual(JSDAY_CANARIAS.id)
    expect(firstEvent.name).toEqual(JSDAY_CANARIAS.name)
    expect(firstEvent.dateRange.startDate).toEqual(JSDAY_CANARIAS.startDate.toISOString())
    expect(firstEvent.dateRange.endDate).toEqual(JSDAY_CANARIAS.endDate.toISOString())
  })
})
