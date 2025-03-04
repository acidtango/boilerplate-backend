import type { interfaces } from 'inversify'
import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import { containerMiddleware } from './middlewares/ContainerMiddleware.ts'
import { Token } from '../../domain/services/Token.ts'
import type { Endpoint } from './factory.ts'
import { requestContextMiddleware } from './middlewares/RequestContext.ts'
import { handle } from './middlewares/ErrorHandler.ts'
import { loggerMiddleware } from './middlewares/LoggerMiddleware.ts'
import { config } from '../config.js'

declare module 'hono' {
  interface ContextVariableMap {
    container: interfaces.Container
  }
}

export function createHono({ container }: interfaces.Context) {
  const app = new Hono()
  app.use(containerMiddleware(container))
  app.use(requestContextMiddleware)
  app.use(loggerMiddleware(container.get(Token.LOGGER)))
  for (const endpoint of container.getAll<Endpoint>(Token.ENDPOINT)) {
    const shouldBeSecured = endpoint.secured ?? true
    const handlers = [
      ...(shouldBeSecured ? [jwt({ secret: config.jwt.secret })] : []),
      ...endpoint.handlers,
    ]
    app[endpoint.method](endpoint.path, ...handlers)
  }
  app.onError(handle)

  return app
}
