import type { interfaces } from 'inversify'
import { createMiddleware } from 'hono/factory'

export function containerMiddleware(container: interfaces.Container) {
  return createMiddleware(async (c, next) => {
    c.set('container', container)
    await next()
  })
}
