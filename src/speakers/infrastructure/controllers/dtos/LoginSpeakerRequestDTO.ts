import { z } from '../../../../shared/infrastructure/controllers/zod.ts'
import { CONCHA_ASENSIO } from '../../../../shared/infrastructure/fixtures/speakers.ts'

export const LoginSpeakerRequestDTO = z
  .object({
    email: z.string().email().openapi({ example: CONCHA_ASENSIO.email }),
    password: z.string().openapi({ example: CONCHA_ASENSIO.password }),
  })
  .openapi({
    ref: 'LoginSpeakerRequestDTO',
    description: 'TODO',
  })
