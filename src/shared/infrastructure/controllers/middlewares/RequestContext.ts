import { AsyncLocalStorage } from 'node:async_hooks'
import { randomUUID } from 'node:crypto'
import { createMiddleware } from 'hono/factory'

export class RequestContext {
  private asyncLocalStorage = new AsyncLocalStorage<Map<string, string>>()

  run(callback: () => Promise<void>) {
    return this.asyncLocalStorage.run(new Map(), callback)
  }

  assignId() {
    this.asyncLocalStorage.getStore()?.set('requestId', randomUUID())
  }

  getId(): string | undefined {
    return this.asyncLocalStorage.getStore()?.get('requestId')
  }
}

export const requestContextMiddleware = createMiddleware(async (c, next) => {
  const requestContext = c.var.container.get(RequestContext)
  await requestContext.run(async () => {
    requestContext.assignId()
    await next()
  })
})
