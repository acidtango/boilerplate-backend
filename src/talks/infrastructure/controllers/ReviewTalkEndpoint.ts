import { describeRoute } from 'hono-openapi'
import { validator } from 'hono-openapi/zod'
import { OrganizerId } from '../../../shared/domain/models/ids/OrganizerId.ts'
import { TalkId } from '../../../shared/domain/models/ids/TalkId.ts'
import { type Endpoint, factory } from '../../../shared/infrastructure/controllers/factory.ts'
import { ApiTag } from '../../../shared/infrastructure/controllers/schemas/ApiTag.ts'
import { z } from '../../../shared/infrastructure/controllers/zod.ts'
import { ReviewTalk } from '../../use-cases/ReviewTalk.ts'
import { ReviewTalkRequestDTO } from './dtos/ReviewTalkRequestDTO.ts'
import { TalkIdDTO } from './dtos/TalkIdDTO.ts'

const ParamsSchema = z.object({
  id: TalkIdDTO,
})

export const ReviewTalkEndpoint = {
  method: 'put' as const,
  path: '/api/v1/talks/:id/assignation',
  handlers: factory.createHandlers(
    describeRoute({
      summary: 'Assign a reviewer to a talk',
      description:
        "Assigns a reviewer to evaluate a proposed talk. This changes the status of the talk to 'REVIEWING' and links the talk to the specified reviewer ID.",
      tags: [ApiTag.TALKS],
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
    },
  ),
} satisfies Endpoint
