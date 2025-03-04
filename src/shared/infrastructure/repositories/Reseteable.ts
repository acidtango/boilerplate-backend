export interface Reseteable {
  /**
   * Clears the any previously saved state
   */
  reset(): Promise<void>
}

export function isReseteable(object: unknown): object is Reseteable {
  if (!object) return false
  if (typeof object !== 'object') return false

  return 'reset' in object
}
