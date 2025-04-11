import { describeRoute } from 'hono-openapi'
import { resolver, validator } from 'hono-openapi/zod'
import { SpeakerId } from '../../../shared/domain/models/ids/SpeakerId.ts'
import { type Endpoint, factory } from '../../../shared/infrastructure/controllers/factory.ts'
import { ApiTag } from '../../../shared/infrastructure/controllers/schemas/ApiTag.ts'
import { z } from '../../../shared/infrastructure/controllers/zod.ts'
import type { SpeakerProfilePrimitives } from '../../domain/models/SpeakerProfile.ts'
import { GetSpeaker } from '../../use-cases/GetSpeaker.ts'
import { SpeakerIdDTO } from './dtos/SpeakerIdDTO.ts'
import type { SpeakerProfileDTO } from './dtos/SpeakerProfileDTO.ts'
import { SpeakerResponseDTO } from './dtos/SpeakerResponseDTO.ts'

const ParamsSchema = z.object({
  id: SpeakerIdDTO,
})

export const GetSpeakerEndpoint = {
  method: 'get' as const,
  path: '/api/v1/speakers/:id',
  handlers: factory.createHandlers(
    describeRoute({
      summary: 'Retrieve speaker profile',
      description: 'Fetches the profile details of a specific speaker by their ID.',
      tags: [ApiTag.SPEAKERS],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Ok',
          content: {
            'application/json': {
              schema: resolver(SpeakerResponseDTO),
            },
          },
        },
      },
    }),
    validator('param', ParamsSchema),
    async (c) => {
      const getSpeaker = await c.var.container.getAsync(GetSpeaker)
      const param = c.req.valid('param')

      const speaker = await getSpeaker.execute(SpeakerId.fromPrimitives(param.id))

      const speakerPrimitives = speaker.toPrimitives()

      return c.json(
        {
          id: speakerPrimitives.id,
          email: speakerPrimitives.email,
          isEmailValidated: speakerPrimitives.isEmailValidated,
          profile: mapProfileToDTO(speakerPrimitives.profile),
        },
        200,
      )
    },
  ),
} satisfies Endpoint

function mapProfileToDTO(
  profilePrimitives?: SpeakerProfilePrimitives,
): SpeakerProfileDTO | undefined {
  if (!profilePrimitives) {
    return undefined
  }

  return {
    name: profilePrimitives.name,
    age: profilePrimitives.age,
    language: profilePrimitives.language,
  }
}
