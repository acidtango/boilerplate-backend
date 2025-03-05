import { Instant } from '../../../domain/models/Instant.ts'
import type { Clock } from '../../../domain/services/Clock.ts'

export class ClockDate implements Clock {
  now(): Instant {
    return new Instant(new Date())
  }
}
