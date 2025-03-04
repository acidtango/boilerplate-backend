import * as crypto from 'node:crypto'
import type { Crypto } from '../../../domain/services/Crypto.ts'

export class CryptoNode implements Crypto {
  async generateSalt(): Promise<string> {
    return crypto.randomBytes(16).toString('hex')
  }
}
