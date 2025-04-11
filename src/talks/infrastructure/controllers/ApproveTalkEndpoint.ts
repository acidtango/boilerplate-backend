import { describeRoute } from 'hono-openapi'
import { validator } from 'hono-openapi/zod'
import { TalkId } from '../../../shared/domain/models/ids/TalkId.ts'
import { type Endpoint, factory } from '../../../shared/infrastructure/controllers/factory.ts'
import { ApiTag } from '../../../shared/infrastructure/controllers/schemas/ApiTag.ts'
import { z } from '../../../shared/infrastructure/controllers/zod.ts'
import { ApproveTalk } from '../../use-cases/ApproveTalk.ts'
import { TalkIdDTO } from './dtos/TalkIdDTO.ts'

const ParamsSchema = z.object({
  id: TalkIdDTO,
})

export const ApproveTalkEndpoint = {
  method: 'put' as const,
  path: '/api/v1/talks/:id/approve',
  handlers: factory.createHandlers(
    describeRoute({
      summary: 'Approve a talk',
      description:
        'Marks the talk as approved. This is typically performed by a reviewer after evaluating the content of the talk. Once approved, the talk can be scheduled in the corresponding event.',
      tags: [ApiTag.TALKS],
      security: [{ bearerAuth: [] }],
      responses: {
        204: {
          description: 'Talk approved',
        },
      },
    }),
    validator('param', ParamsSchema),
    async (c) => {
      const approveTalk = await c.var.container.getAsync(ApproveTalk)
      const param = c.req.valid('param')

      await approveTalk.execute(TalkId.fromPrimitives(param.id))

      return c.body(null, 204)
    },
  ),
} satisfies Endpoint
