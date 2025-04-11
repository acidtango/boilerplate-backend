import { describeRoute } from 'hono-openapi'
import { validator } from 'hono-openapi/zod'
import { EventId } from '../../../shared/domain/models/ids/EventId.ts'
import { SpeakerId } from '../../../shared/domain/models/ids/SpeakerId.ts'
import { TalkId } from '../../../shared/domain/models/ids/TalkId.ts'
import { type Endpoint, factory } from '../../../shared/infrastructure/controllers/factory.ts'
import { ApiTag } from '../../../shared/infrastructure/controllers/schemas/ApiTag.ts'
import { TalkDescription } from '../../domain/models/TalkDescription.ts'
import { TalkTitle } from '../../domain/models/TalkTitle.ts'
import { ProposeTalk } from '../../use-cases/ProposeTalk.ts'
import { ProposeTalkRequestDTO } from './dtos/ProposeTalkRequestDTO.ts'

export const ProposeTalkEndpoint = {
  method: 'post' as const,
  path: '/api/v1/talks',
  handlers: factory.createHandlers(
    describeRoute({
      summary: 'Propose a new talk',
      description:
        'Allows a registered speaker to propose a talk for a specific event. The talk must include a title, description, language, and optionally, co-speakers. The talk is initially submitted as a proposal and awaits review.',
      tags: [ApiTag.TALKS],
      security: [{ bearerAuth: [] }],
      responses: {
        201: {
          description: 'Talk proposed',
        },
      },
    }),
    validator('json', ProposeTalkRequestDTO),
    async (c) => {
      const proposeTalk = await c.var.container.getAsync(ProposeTalk)
      const body = c.req.valid('json')

      await proposeTalk.execute({
        id: TalkId.fromPrimitives(body.id),
        title: TalkTitle.fromPrimitives(body.title),
        description: TalkDescription.fromPrimitives(body.description),
        cospeakers: body.cospeakers.map(SpeakerId.fromPrimitives),
        language: body.language,
        eventId: EventId.fromPrimitives(body.eventId),
        speakerId: SpeakerId.fromPrimitives(body.speakerId),
      })

      return c.body(null, 201)
    },
  ),
} satisfies Endpoint
