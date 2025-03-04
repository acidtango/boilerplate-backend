import { createMiddleware } from 'hono/factory'
import type { interfaces } from 'inversify'

export function containerMiddleware(container: interfaces.Container) {
  return createMiddleware(async (c, next) => {
    c.set('container', container)
    await next()
  })
}
