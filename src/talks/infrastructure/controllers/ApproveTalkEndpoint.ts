import { describeRoute } from 'hono-openapi'
import { validator } from 'hono-openapi/zod'
import { type Endpoint, factory } from '../../../shared/infrastructure/controllers/factory.ts'
import { z } from '../../../shared/infrastructure/controllers/zod.ts'
import { ApproveTalk } from '../../use-cases/ApproveTalk.ts'
import { TalkId } from '../../../shared/domain/models/ids/TalkId.ts'
import { JUNIOR_XP } from '../../../shared/infrastructure/fixtures/talks.ts'

const ParamsSchema = z.object({
  id: z
    .string()
    .uuid()
    .openapi({
      param: {
        name: 'id',
        in: 'path',
      },
      example: JUNIOR_XP.id,
    }),
})

export const ApproveTalkEndpoint = {
  method: 'put' as const,
  path: '/api/v1/talks/:id/approve',
  handlers: factory.createHandlers(
    describeRoute({
      description: 'Approves a talk',
      tags: ['Talks'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Talk approved',
        },
      },
    }),
    validator('param', ParamsSchema),
    async (c) => {
      const approveTalk = await c.var.container.getAsync(ApproveTalk)
      const param = c.req.valid('param')

      await approveTalk.execute(TalkId.fromPrimitives(param.id))

      return c.body(null, 200)
    }
  ),
} satisfies Endpoint
