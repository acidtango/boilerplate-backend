export interface Logger {
  trace(object: unknown): void
  debug(object: unknown): void
  info(object: unknown): void
  warn(object: unknown): void
  error(object: unknown): void
}
