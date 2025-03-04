import type { Role } from '../../shared/domain/models/Role.ts'

export type JwtPayload = {
  /**
   * The subject (user) identifier of the token.
   */
  sub: string

  /**
   * The timestamp when the token was issued (Issued At).
   */
  iat: number

  /**
   * The timestamp when the token expires.
   */
  exp: number

  /**
   * The role of the user associated with the token.
   */
  role: Role
}
