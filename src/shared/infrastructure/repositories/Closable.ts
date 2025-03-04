export interface Closable {
  /**
   * Does any teardown process
   */
  close(): Promise<void>
}

export function isClosable(object: unknown): object is Closable {
  if (!object) return false
  if (typeof object !== 'object') return false

  return 'close' in object
}
