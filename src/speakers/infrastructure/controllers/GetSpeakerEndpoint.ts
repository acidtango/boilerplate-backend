import { describeRoute } from 'hono-openapi'
import { resolver, validator } from 'hono-openapi/zod'
import { GetSpeaker } from '../../use-cases/GetSpeaker.ts'
import { SpeakerResponseDTO } from './dtos/SpeakerResponseDTO.ts'
import { CONCHA_ASENSIO } from '../../../shared/infrastructure/fixtures/speakers.ts'
import { SpeakerId } from '../../../shared/domain/models/ids/SpeakerId.ts'
import type { SpeakerProfilePrimitives } from '../../domain/models/SpeakerProfile.ts'
import { SpeakerProfileDTO } from './dtos/SpeakerProfileDTO.ts'
import { type Endpoint, factory } from '../../../shared/infrastructure/controllers/factory.ts'
import { z } from '../../../shared/infrastructure/controllers/zod.ts'

const ParamsSchema = z.object({
  id: z
    .string()
    .uuid()
    .openapi({
      param: {
        name: 'id',
        in: 'path',
      },
      example: CONCHA_ASENSIO.id,
    }),
})

export const GetSpeakerEndpoint = {
  method: 'get' as const,
  path: '/api/v1/speakers/:id',
  handlers: factory.createHandlers(
    describeRoute({
      description: 'Gets a speaker profile',
      tags: ['Speakers'],
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
          isEmailValidated: 3,
          profile: mapProfileToDTO(speakerPrimitives.profile),
        },
        200
      )
    }
  ),
} satisfies Endpoint

function mapProfileToDTO(
  profilePrimitives?: SpeakerProfilePrimitives
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
