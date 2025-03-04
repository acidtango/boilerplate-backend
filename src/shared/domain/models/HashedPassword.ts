import * as crypto from 'node:crypto'
import { ValueObject } from './hex/ValueObject.ts'

export class HashedPassword extends ValueObject {
  private readonly hash: string

  constructor(hash: string) {
    super()
    this.hash = hash
  }

  static fromPrimitives(hash: string): HashedPassword {
    return new HashedPassword(hash)
  }

  toPrimitives() {
    return this.hash
  }

  equalsTo(password: HashedPassword) {
    return crypto.timingSafeEqual(Buffer.from(this.hash), Buffer.from(password.hash))
  }
}
