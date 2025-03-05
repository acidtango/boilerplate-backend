import type { Logger } from '../../../domain/services/Logger.ts'

export class LoggerDummy implements Logger {
  debug(_: unknown): void {}

  error(_: unknown): void {}

  info(_: unknown): void {}

  trace(_: unknown): void {}

  warn(_: unknown): void {}
}
