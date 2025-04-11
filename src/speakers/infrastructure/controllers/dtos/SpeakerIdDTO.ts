import { z } from '../../../../shared/infrastructure/controllers/zod.ts'
import { CONCHA_ASENSIO } from '../../../../shared/infrastructure/fixtures/speakers.ts'

export const SpeakerIdDTO = z
  .string()
  .uuid()
  .openapi({
    ref: 'SpeakerId',
    param: {
      name: 'id',
      in: 'path',
    },
    example: CONCHA_ASENSIO.id,
  })
