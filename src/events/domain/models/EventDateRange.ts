import type { Primitives } from '../../../shared/domain/models/hex/Primitives.ts'
import { ValueObject } from '../../../shared/domain/models/hex/ValueObject.ts'
import { InvalidDateRangeError } from '../errors/InvalidDateRangeError.ts'

type EventDateRangePrimitives = Primitives<EventDateRange>

export class EventDateRange extends ValueObject {
  private readonly startDate: Date

  private readonly endDate: Date

  constructor(startDate: Date, endDate: Date) {
    super()
    if (startDate > endDate) {
      throw new InvalidDateRangeError(startDate, endDate)
    }
    this.endDate = endDate
    this.startDate = startDate
  }

  static fromPrimitives({ startDate, endDate }: EventDateRangePrimitives): EventDateRange {
    return new EventDateRange(startDate, endDate)
  }

  private static toPrimitives(eventDateRange: EventDateRange) {
    return {
      startDate: eventDateRange.startDate,
      endDate: eventDateRange.endDate,
    }
  }

  toPrimitives() {
    return EventDateRange.toPrimitives(this)
  }
}
