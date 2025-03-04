import { sign } from 'hono/jwt'
import type { JwtPayload } from '../../../../auth/domain/JwtPayload.ts'
import type { JwtSigner } from '../../../domain/services/JwtSigner.ts'

export class JwtSignerHono implements JwtSigner {
  async sign(payload: JwtPayload, secret: string): Promise<string> {
    return await sign(payload, secret)
  }
}
