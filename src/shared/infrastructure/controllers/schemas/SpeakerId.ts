import { z } from '../zod.ts'
import { CONCHA_ASENSIO } from '../../fixtures/speakers.ts'

export const SpeakerIdInPath = z
  .string()
  .uuid()
  .openapi({
    param: {
      name: 'id',
      in: 'path',
    },
    example: CONCHA_ASENSIO.id,
  })
