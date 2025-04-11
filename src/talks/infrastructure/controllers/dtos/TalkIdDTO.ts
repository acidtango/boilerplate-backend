import { z } from '../../../../shared/infrastructure/controllers/zod.ts'
import { JUNIOR_XP } from '../../../../shared/infrastructure/fixtures/talks.ts'

export const TalkIdDTO = z
  .string()
  .uuid()
  .openapi({
    ref: 'TalkId',
    param: {
      name: 'id',
      in: 'path',
    },
    example: JUNIOR_XP.id,
  })
