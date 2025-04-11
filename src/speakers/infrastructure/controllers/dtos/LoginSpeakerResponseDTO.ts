import type zod from 'zod'
import { z } from '../../../../shared/infrastructure/controllers/zod.ts'
import { CONCHA_ASENSIO } from '../../../../shared/infrastructure/fixtures/speakers.ts'

export const LoginSpeakerResponseDTO = z
  .object({
    accessToken: z.string().openapi({ example: CONCHA_ASENSIO.jwt }),
  })
  .openapi({
    ref: 'LoginSpeakerResponse',
    description:
      'Response returned upon successful authentication of a speaker. It contains the JWT access token required for authorized requests.',
  })

export type LoginSpeakerResponseDTO = zod.infer<typeof LoginSpeakerResponseDTO>
