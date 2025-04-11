import { z } from '../../../../shared/infrastructure/controllers/zod.ts'
import { DAILOS } from '../../../../shared/infrastructure/fixtures/organizers.ts'

export const ReviewTalkRequestDTO = z
  .object({
    reviewerId: z.string().uuid().openapi({ example: DAILOS.id }),
  })
  .openapi({
    ref: 'ReviewTalkRequest',
    description:
      'Request to assign a reviewer to a proposed talk. Used to begin the evaluation process.',
  })
