import { createFactory } from 'hono/factory'

export const factory = createFactory()

export type Endpoint = {
  method: 'put' | 'get' | 'post' | 'delete'
  path: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handlers: Array<any>
  secured?: boolean
}
