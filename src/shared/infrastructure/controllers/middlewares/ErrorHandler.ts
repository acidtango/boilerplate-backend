import type { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { DomainError } from '../../../domain/errors/DomainError.ts'
import { DomainErrorCode } from '../../../domain/errors/DomainErrorCode.ts'
import type { Logger } from '../../../domain/services/Logger.ts'
import { Token } from '../../../domain/services/Token.ts'
import { domainErrorToHttpStatusCode } from '../../errors/domainErrorToHttpStatusCode.ts'

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
      domainErrorToHttpStatusCode[error.code],
    )
  }

  if (error instanceof HTTPException) {
    logger.debug(error)
    return error.getResponse()
  }

  logger.error(error)
  return c.json(
    {
      code: DomainErrorCode.INTERNAL_ERROR,
      type: error.name,
      message: error.message,
    },
    500,
  )
}
