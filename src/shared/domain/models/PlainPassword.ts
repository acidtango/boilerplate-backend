import * as crypto from 'node:crypto'
import { HashedPassword } from './HashedPassword.ts'
import { ValueObject } from './hex/ValueObject.ts'

export class PlainPassword extends ValueObject {
  private readonly password: string

  constructor(password: string) {
    super()
    this.password = password
  }

  static fromPrimitives(email: string): PlainPassword {
    return new PlainPassword(email)
  }

  toHashed(salt: string) {
    const hash = crypto.pbkdf2Sync(this.password, salt, 1000, 64, 'sha512').toString('hex')
    return new HashedPassword(hash)
  }
}
