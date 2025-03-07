import { createMiddleware } from 'hono/factory'
import type { Logger } from '../../../domain/services/Logger.ts'

export function loggerMiddleware(logger: Logger) {
  return createMiddleware(async (c, next) => {
    await next()
    logger.info({
      path: c.req.path,
      method: c.req.method,
      query: c.req.query,
      status: c.res.status,
    })
  })
}
