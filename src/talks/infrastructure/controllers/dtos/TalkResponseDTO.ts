import { Language } from '../../../../shared/domain/models/Language.ts'
import { z } from '../../../../shared/infrastructure/controllers/zod.ts'
import { JSDAY_CANARIAS } from '../../../../shared/infrastructure/fixtures/events.ts'
import { DAILOS } from '../../../../shared/infrastructure/fixtures/organizers.ts'
import { CONCHA_ASENSIO } from '../../../../shared/infrastructure/fixtures/speakers.ts'
import { JUNIOR_XP } from '../../../../shared/infrastructure/fixtures/talks.ts'
import { TalkStatus } from '../../../domain/models/TalkStatus.ts'

export const TalkResponseDTO = z
  .object({
    id: z.string().uuid().openapi({ example: JUNIOR_XP.id }),
    title: z.string().openapi({ example: JUNIOR_XP.title }),
    description: z.string().openapi({ example: JUNIOR_XP.description }),
    language: z.nativeEnum(Language).openapi({ example: Language.ENGLISH }),
    cospeakers: z.array(z.string()).openapi({ example: JUNIOR_XP.cospeakers }),
    status: z.nativeEnum(TalkStatus).openapi({ example: TalkStatus.PROPOSAL }),
    speakerId: z.string().uuid().openapi({ example: CONCHA_ASENSIO.id }),
    reviewerId: z.string().uuid().nullable().openapi({ example: DAILOS.id }),
    isApproved: z.boolean().nullable().openapi({ example: false }),
    eventId: z.string().uuid().openapi({ example: JSDAY_CANARIAS.id }),
  })
  .openapi({
    ref: 'TalkResponse',
    description:
      'Detailed response for a proposed talk, including all metadata, speaker and reviewer IDs, current status, and approval state.',
  })
