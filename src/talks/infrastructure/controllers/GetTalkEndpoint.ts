import { describeRoute } from 'hono-openapi'
import { resolver, validator } from 'hono-openapi/zod'
import { TalkId } from '../../../shared/domain/models/ids/TalkId.ts'
import { type Endpoint, factory } from '../../../shared/infrastructure/controllers/factory.ts'
import { TalkIdInPath } from '../../../shared/infrastructure/controllers/schemas/TalkId.ts'
import { z } from '../../../shared/infrastructure/controllers/zod.ts'
import { GetTalk } from '../../use-cases/GetTalk.ts'
import { TalkResponseDTO } from './dtos/TalkResponseDTO.ts'

const ParamsSchema = z.object({
  id: TalkIdInPath,
})

export const GetTalkEndpoint = {
  method: 'get' as const,
  path: '/api/v1/talks/:id',
  handlers: factory.createHandlers(
    describeRoute({
      description: 'Get a talk by id',
      tags: ['Talks'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Ok',
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
