import { describe, expect, it } from 'vitest'
import { ClockFake } from '../../infrastructure/services/clock/ClockFake.ts'
import { Instant } from './Instant.ts'

describe('Instant', () => {
  it('saves a given date', () => {
    const date = new Date()

    const instant = new Instant(date)

    expect(instant.toDate()).toEqual(date)
  })

  it('converts an instant to seconds', () => {
    const date = new Date(ClockFake.now)
    const instant = new Instant(date)

    const seconds = instant.toSeconds()

    expect(seconds).toEqual(1684333800)
  })

  it('can add a number of days', () => {
    const today = new Instant(ClockFake.now)

    const tomorrow = today.addDays(1)

    expect(tomorrow).toEqual(new Instant(ClockFake.tomorrow))
  })
})
