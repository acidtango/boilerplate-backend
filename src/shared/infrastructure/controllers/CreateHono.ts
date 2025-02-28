import type { interfaces } from 'inversify'
import { Hono } from 'hono'
import { containerMiddleware } from './ContainerMiddleware.ts'
import { Token } from '../../domain/services/Token.ts'
import type { Endpoint } from './factory.ts'
import { DomainError } from '../../domain/errors/DomainError.ts'
import { domainErrorToHttpStatusCode } from '../errors/domainErrorToHttpStatusCode.ts'
import { DomainErrorCode } from '../../domain/errors/DomainErrorCode.ts'

declare module 'hono' {
  interface ContextVariableMap {
    container: interfaces.Container
  }
}

export function createHono({ container }: interfaces.Context) {
  const app = new Hono()
  app.use(containerMiddleware(container))

  const endpoints = container.getAll<Endpoint>(Token.ENDPOINT)

  for (const endpoint of endpoints) {
    app[endpoint.method](endpoint.path, ...endpoint.handlers)
  }

  app.onError((error, c) => {
    if (error instanceof DomainError) {
      return c.json(
        {
          code: error.code,
          type: error.name,
          message: error.message,
        },
        domainErrorToHttpStatusCode[error.code]
      )
    }

    return c.json(
      {
        code: DomainErrorCode.INTERNAL_ERROR,
        type: error.name,
        message: error.message,
      },
      500
    )
  })

  return app
}
