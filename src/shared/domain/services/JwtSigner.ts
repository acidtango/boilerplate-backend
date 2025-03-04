import type { JwtPayload } from '../../../auth/domain/JwtPayload.ts'

export interface JwtSigner {
  sign(payload: JwtPayload, secret: string): Promise<string>
}
