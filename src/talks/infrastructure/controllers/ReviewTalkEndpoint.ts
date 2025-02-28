import { describeRoute } from 'hono-openapi'
import { validator } from 'hono-openapi/zod'
import { OrganizerId } from '../../../shared/domain/models/ids/OrganizerId.ts'
import { TalkId } from '../../../shared/domain/models/ids/TalkId.ts'
import { ReviewTalk } from '../../use-cases/ReviewTalk.ts'
import { ReviewTalkRequestDTO } from './dtos/ReviewTalkRequestDTO.ts'
import { JUNIOR_XP } from '../../../shared/infrastructure/fixtures/talks.ts'
import { z } from '../../../shared/infrastructure/controllers/zod.ts'
import { type Endpoint, factory } from '../../../shared/infrastructure/controllers/factory.ts'

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

export const ReviewTalkEndpoint = {
  method: 'put' as const,
  path: '/api/v1/talks/:id/assignation',
  handlers: factory.createHandlers(
    describeRoute({
      description: 'Assigns a talk for review',
      tags: ['Talks'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Talk assigned for review',
        },
      },
    }),
    validator('param', ParamsSchema),
    validator('json', ReviewTalkRequestDTO),
    async (c) => {
      const reviewTalk = await c.var.container.getAsync(ReviewTalk)
      const param = c.req.valid('param')
      const body = c.req.valid('json')

      await reviewTalk.execute({
        talkId: TalkId.fromPrimitives(param.id),
        reviewerId: OrganizerId.fromPrimitives(body.reviewerId),
      })

      return c.body(null, 200)
    }
  ),
} satisfies Endpoint
