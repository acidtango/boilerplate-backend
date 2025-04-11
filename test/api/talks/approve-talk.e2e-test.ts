import { describe, expect, it } from 'vitest'
import { DAILOS } from '../../../src/shared/infrastructure/fixtures/organizers.ts'
import { JUNIOR_XP } from '../../../src/shared/infrastructure/fixtures/talks.ts'
import { createClient } from '../../utils/createClient.ts'

describe('talk can be approved or rejected', () => {
  it(
    'can approve the talk',
    async () => {
      const client = await createClient()
      await client.createConcha()
      await client.createJsDayCanarias()
      await client.proposeTalk({ id: JUNIOR_XP.id })
      await client.assignReviewer({ id: JUNIOR_XP.id, reviewerId: DAILOS.id })

      await client.approveTalk({ id: JUNIOR_XP.id })

      await expect(client.getTalk(JUNIOR_XP.id)).hasBody({
        cospeakers: expect.any(Array),
        description: expect.any(String),
        eventId: expect.any(String),
        id: expect.any(String),
        isApproved: expect.any(Boolean),
        language: expect.any(String),
        reviewerId: expect.any(String),
        speakerId: expect.any(String),
        status: 'APPROVED',
        title: expect.any(String),
      })
    },
    Number.POSITIVE_INFINITY,
  )
})
