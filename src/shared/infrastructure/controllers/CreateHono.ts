import type { interfaces } from 'inversify'
import { Hono } from 'hono'
import { containerMiddleware } from './middlewares/ContainerMiddleware.ts'
import { Token } from '../../domain/services/Token.ts'
import type { Endpoint } from './factory.ts'
import { requestContextMiddleware } from './middlewares/RequestContext.ts'
import { handle } from './middlewares/ErrorHandler.ts'
import { loggerMiddleware } from './middlewares/LoggerMiddleware.ts'

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
    app[endpoint.method](endpoint.path, ...endpoint.handlers)
  }
  app.onError(handle)

  return app
}
