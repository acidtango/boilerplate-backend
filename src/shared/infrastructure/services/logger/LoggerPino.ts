import { RequestContext } from '../../controllers/middlewares/RequestContext.ts'
import { type interfaces } from 'inversify'
import { type Logger as LoggerPinoLibrary, pino } from 'pino'
import type { Logger } from '../../../domain/services/Logger.ts'
import { config } from '../../config.ts'

export class LoggerPino implements Logger {
  private logger: LoggerPinoLibrary<never, boolean>

  public static create({ container }: interfaces.Context) {
    return new LoggerPino(container.get(RequestContext))
  }

  constructor(requestContext: RequestContext) {
    this.logger = pino({
      level: config.logger.level,
      transport: {
        target: 'pino-pretty',
      },
      mixin: () => ({
        requestId: requestContext.getId(),
      }),
    })
  }

  debug(object: unknown): void {
    this.logger.debug(object)
  }

  error(object: unknown): void {
    this.logger.error(object)
  }

  info(object: unknown): void {
    this.logger.info(object)
  }

  trace(object: unknown): void {
    this.logger.trace(object)
  }

  warn(object: unknown): void {
    this.logger.warn(object)
  }
}
