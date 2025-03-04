import type { Hono } from 'hono'
import { container } from './container.ts'
import { Token } from './shared/domain/services/Token.ts'

export const app = await container.getAsync<Hono>(Token.APP)
