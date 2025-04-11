import { z } from '../../../../shared/infrastructure/controllers/zod.ts'
import { CONCHA_ASENSIO } from '../../../../shared/infrastructure/fixtures/speakers.ts'
import { SpeakerIdDTO } from './SpeakerIdDTO.ts'
import { SpeakerProfileDTO } from './SpeakerProfileDTO.ts'

export const SpeakerResponseDTO = z
  .object({
    id: SpeakerIdDTO,
    email: z.string().email().openapi({ example: CONCHA_ASENSIO.email }),
    isEmailValidated: z.boolean().openapi({ example: true }),
    profile: SpeakerProfileDTO.optional(),
  })
  .openapi({
    ref: 'SpeakerResponse',
    description:
      'Details of a registered speaker, including their unique ID, email, email validation status, and profile information if available.',
  })
