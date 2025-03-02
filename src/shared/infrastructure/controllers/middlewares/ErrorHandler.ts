import type { Context } from 'hono'
import { DomainError } from '../../../domain/errors/DomainError.ts'
import { domainErrorToHttpStatusCode } from '../../errors/domainErrorToHttpStatusCode.ts'
import { DomainErrorCode } from '../../../domain/errors/DomainErrorCode.ts'
import { Token } from '../../../domain/services/Token.ts'
import type { Logger } from '../../../domain/services/Logger.ts'

export function handle(error: Error, c: Context) {
  const logger = c.var.container.get<Logger>(Token.LOGGER)

  if (error instanceof DomainError) {
    logger.debug(error)
    return c.json(
      {
        code: error.code,
        type: error.name,
        message: error.message,
      },
      domainErrorToHttpStatusCode[error.code]
    )
  }

  logger.error(error)
  return c.json(
    {
      code: DomainErrorCode.INTERNAL_ERROR,
      type: error.name,
      message: error.message,
    },
    500
  )
}
