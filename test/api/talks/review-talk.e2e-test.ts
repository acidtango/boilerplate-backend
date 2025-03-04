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

    const { status } = await client.assignReviewer({
      id: JUNIOR_XP.id,
      reviewerId: DAILOS.id,
    })

    expect(status).toEqual(200)
    const { body: talk } = await client.getTalk(JUNIOR_XP.id)
    expect(talk.status).toEqual('REVIEWING')
    expect(talk.reviewerId).toEqual(DAILOS.id)
  })
})
