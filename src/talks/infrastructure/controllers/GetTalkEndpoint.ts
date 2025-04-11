import { describeRoute } from 'hono-openapi'
import { resolver, validator } from 'hono-openapi/zod'
import { TalkId } from '../../../shared/domain/models/ids/TalkId.ts'
import { type Endpoint, factory } from '../../../shared/infrastructure/controllers/factory.ts'
import { ApiTag } from '../../../shared/infrastructure/controllers/schemas/ApiTag.ts'
import { z } from '../../../shared/infrastructure/controllers/zod.ts'
import { GetTalk } from '../../use-cases/GetTalk.ts'
import { TalkIdDTO } from './dtos/TalkIdDTO.ts'
import { TalkResponseDTO } from './dtos/TalkResponseDTO.ts'

const ParamsSchema = z.object({
  id: TalkIdDTO,
})

export const GetTalkEndpoint = {
  method: 'get' as const,
  path: '/api/v1/talks/:id',
  handlers: factory.createHandlers(
    describeRoute({
      summary: 'Get talk details',
      description:
        'Fetches detailed information about a talk using its unique identifier. This includes title, description, language, status, assigned reviewer, approval status, and associated speaker and event.',
      tags: [ApiTag.TALKS],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Successfully retrieved talk details',
          content: {
            'application/json': {
              schema: resolver(TalkResponseDTO),
            },
          },
        },
      },
    }),
    validator('param', ParamsSchema),
    async (c) => {
      const getTalk = await c.var.container.getAsync(GetTalk)
      const param = c.req.valid('param')

      const talk = await getTalk.execute(new TalkId(param.id))

      const talkPrimitives = talk.toPrimitives()

      return c.json(talkPrimitives)
    },
  ),
} satisfies Endpoint
