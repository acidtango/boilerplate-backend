import { describe, expect, it } from 'vitest'
import { JSDAY_CANARIAS } from '../../../infrastructure/fixtures/events.ts'
import { EventId } from './EventId.ts'

describe('EventId', () => {
  it('is serializable', () => {
    const eventIdPrimitive = JSDAY_CANARIAS.id

    const id = EventId.fromPrimitives(eventIdPrimitive)

    expect(id).toBeInstanceOf(EventId)
    expect(id.toPrimitives()).toEqual(eventIdPrimitive)
  })
})
