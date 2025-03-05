export class Instant {
  private static addDaysToDate(date: Date, number: number) {
    const clonedDate = new Date(date)
    clonedDate.setDate(date.getDate() + number)
    return clonedDate
  }

  private readonly date: Date

  constructor(date: Date) {
    this.date = date
  }

  toDate() {
    return this.date
  }

  toSeconds(): number {
    return Math.round(this.date.getTime() / 1000)
  }

  addDays(number: number): Instant {
    const date = Instant.addDaysToDate(this.date, number)
    return new Instant(date)
  }
}
