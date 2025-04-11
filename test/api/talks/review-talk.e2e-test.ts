import { describe, expect, it } from 'vitest'
import { DAILOS } from '../../../src/shared/infrastructure/fixtures/organizers.ts'
import { JUNIOR_XP } from '../../../src/shared/infrastructure/fixtures/talks.ts'
import { createClient } from '../../utils/createClient.ts'

describe('talk can be reviewed', () => {
  it('can be created', async () => {
    const client = await createClient()
    await client.createConcha()
    await client.createJsDayCanarias()
    await client.proposeTalk({ id: JUNIOR_XP.id })

    await client.assignReviewer({ id: JUNIOR_XP.id, reviewerId: DAILOS.id })

    await expect(client.getTalk(JUNIOR_XP.id)).hasBody({
      cospeakers: [],
      description: expect.any(String),
      eventId: expect.any(String),
      id: expect.any(String),
      language: expect.any(String),
      reviewerId: DAILOS.id,
      speakerId: expect.any(String),
      status: 'REVIEWING',
      title: expect.any(String),
    })
  })
})
