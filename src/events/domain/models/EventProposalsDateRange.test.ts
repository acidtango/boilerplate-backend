import { describe, expect, it } from 'vitest'
import { JSDAY_CANARIAS } from '../../../shared/infrastructure/fixtures/events.ts'
import { InvalidDateRangeError } from '../errors/InvalidDateRangeError.ts'
import { EventProposalsDateRange } from './EventProposalsDateRange.ts'

describe('EventProposalsDateRange', () => {
  it('is serializable', () => {
    const { proposalsStartDate, proposalsDeadlineDate } = JSDAY_CANARIAS

    const proposalsDateRange = EventProposalsDateRange.fromPrimitives({
      startDate: proposalsStartDate,
      deadline: proposalsDeadlineDate,
    })

    expect(proposalsDateRange).toBeInstanceOf(EventProposalsDateRange)
    expect(proposalsDateRange.toPrimitives()).toEqual({
      startDate: proposalsStartDate,
      deadline: proposalsDeadlineDate,
    })
  })

  it('fails if event start date is greater than end date', () => {
    expect(() => {
      new EventProposalsDateRange(
        JSDAY_CANARIAS.proposalsDeadlineDate,
        JSDAY_CANARIAS.proposalsStartDate,
      )
    }).toThrowError(
      new InvalidDateRangeError(
        JSDAY_CANARIAS.proposalsDeadlineDate,
        JSDAY_CANARIAS.proposalsStartDate,
      ),
    )
  })
})
