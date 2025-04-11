import { describe, expect, it } from 'vitest'
import { JSDAY_CANARIAS } from '../../../src/shared/infrastructure/fixtures/events.js'
import { CONCHA_ASENSIO } from '../../../src/shared/infrastructure/fixtures/speakers.js'
import { JUNIOR_XP } from '../../../src/shared/infrastructure/fixtures/talks.ts'
import { createClient } from '../../utils/createClient.ts'
import { waitFor } from '../../utils/waitFor.ts'

describe('create talk', () => {
  it('can be created', async () => {
    const client = await createClient()
    await client.createConcha()
    await client.createJsDayCanarias()

    await client.proposeTalk({ id: JUNIOR_XP.id })

    await expect(client.getTalk(JUNIOR_XP.id)).hasBody({
      cospeakers: [],
      description: JUNIOR_XP.description,
      eventId: JSDAY_CANARIAS.id,
      id: JUNIOR_XP.id,
      language: JUNIOR_XP.language,
      speakerId: CONCHA_ASENSIO.id,
      status: 'PROPOSAL',
      title: JUNIOR_XP.title,
    })
  })

  it('sends an email to the speaker', async () => {
    const client = await createClient()
    const emailSender = client.getEmailSender()
    await client.createConcha()
    await client.createJsDayCanarias()

    await client.proposeTalk({ id: JUNIOR_XP.id })

    await waitFor(async () => {
      emailSender.expectSendThanksForProposalSent()
    })
  })
})
