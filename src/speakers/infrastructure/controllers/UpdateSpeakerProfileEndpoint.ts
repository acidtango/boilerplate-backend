import { describeRoute } from 'hono-openapi'
import { validator } from 'hono-openapi/zod'
import { SpeakerId } from '../../../shared/domain/models/ids/SpeakerId.ts'
import { type Endpoint, factory } from '../../../shared/infrastructure/controllers/factory.ts'
import { ApiTag } from '../../../shared/infrastructure/controllers/schemas/ApiTag.ts'
import { z } from '../../../shared/infrastructure/controllers/zod.ts'
import { SpeakerAge } from '../../domain/models/SpeakerAge.ts'
import { SpeakerName } from '../../domain/models/SpeakerName.ts'
import { UpdateSpeakerProfile } from '../../use-cases/UpdateSpeakerProfile.ts'
import { SpeakerIdDTO } from './dtos/SpeakerIdDTO.ts'
import { SpeakerProfileDTO } from './dtos/SpeakerProfileDTO.ts'

const ParamsSchema = z.object({
  id: SpeakerIdDTO,
})

export const UpdateSpeakerProfileEndpoint = {
  method: 'put' as const,
  path: '/api/v1/speakers/:id/profile',
  handlers: factory.createHandlers(
    describeRoute({
      summary: 'Update speaker profile',
      description:
        'Updates the profile of a speaker, including their name, age, and language preferences.',
      tags: [ApiTag.SPEAKERS],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Speaker profile updated',
        },
      },
    }),
    validator('json', SpeakerProfileDTO),
    validator('param', ParamsSchema),
    async (c) => {
      const updateSpeakerProfile = await c.var.container.getAsync(UpdateSpeakerProfile)
      const body = c.req.valid('json')
      const param = c.req.valid('param')
      await updateSpeakerProfile.execute({
        id: SpeakerId.fromPrimitives(param.id),
        name: SpeakerName.fromPrimitives(body.name),
        age: SpeakerAge.fromPrimitives(body.age),
        language: body.language,
      })
      return c.body(null, 200)
    },
  ),
} satisfies Endpoint
