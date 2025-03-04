import { describe, expect, it } from 'vitest'
import { JSDAY_CANARIAS } from '../../../shared/infrastructure/fixtures/events.ts'
import { InvalidDateRangeError } from '../errors/InvalidDateRangeError.ts'
import { EventDateRange } from './EventDateRange.ts'

describe('EventDateRange', () => {
  it('is serializable', () => {
    const { startDate, endDate } = JSDAY_CANARIAS

    const eventDateRange = EventDateRange.fromPrimitives({
      startDate,
      endDate,
    })

    expect(eventDateRange).toBeInstanceOf(EventDateRange)
    expect(eventDateRange.toPrimitives()).toEqual({ startDate, endDate })
  })

  it('fails if event start date is greater than end date', () => {
    expect(() => {
      new EventDateRange(JSDAY_CANARIAS.endDate, JSDAY_CANARIAS.startDate)
    }).toThrowError(new InvalidDateRangeError(JSDAY_CANARIAS.endDate, JSDAY_CANARIAS.startDate))
  })
})
