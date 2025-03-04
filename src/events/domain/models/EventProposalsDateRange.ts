import type { Primitives } from '../../../shared/domain/models/hex/Primitives.ts'
import { ValueObject } from '../../../shared/domain/models/hex/ValueObject.ts'
import { InvalidDateRangeError } from '../errors/InvalidDateRangeError.ts'

type EventProposalDateRangePrimitives = Primitives<EventProposalsDateRange>

export class EventProposalsDateRange extends ValueObject {
  private readonly startDate: Date

  private readonly deadline: Date

  constructor(startDate: Date, deadline: Date) {
    super()
    if (startDate > deadline) {
      throw new InvalidDateRangeError(startDate, deadline)
    }
    this.deadline = deadline
    this.startDate = startDate
  }

  static fromPrimitives({
    startDate,
    deadline,
  }: EventProposalDateRangePrimitives): EventProposalsDateRange {
    return new EventProposalsDateRange(startDate, deadline)
  }

  private static toPrimitives(eventProposalsDateRange: EventProposalsDateRange) {
    return {
      startDate: eventProposalsDateRange.startDate,
      deadline: eventProposalsDateRange.deadline,
    }
  }

  toPrimitives() {
    return EventProposalsDateRange.toPrimitives(this)
  }
}
