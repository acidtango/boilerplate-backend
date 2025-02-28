import { JUNIOR_XP } from '../../fixtures/talks.ts'
import { z } from '../zod.ts'

export const TalkIdInPath = z
  .string()
  .uuid()
  .openapi({
    param: {
      name: 'id',
      in: 'path',
    },
    example: JUNIOR_XP.id,
  })
