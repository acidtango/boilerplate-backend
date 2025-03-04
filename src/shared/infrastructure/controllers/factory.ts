import { createFactory } from 'hono/factory'

export const factory = createFactory()

export type Endpoint = {
  method: 'put' | 'get' | 'post' | 'delete'
  path: string
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  handlers: Array<any>
  secured?: boolean
}
