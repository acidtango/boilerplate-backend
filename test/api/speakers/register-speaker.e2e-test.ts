import type { JwtPayload } from 'jsonwebtoken'
import * as jwt from 'jsonwebtoken'
import { describe, expect, it } from 'vitest'
import { CONCHA_ASENSIO } from '../../../src/shared/infrastructure/fixtures/speakers.ts'
import { createClient } from '../../utils/TestClient.ts'

describe('register speaker', () => {
  it('registers the user and then can login', async () => {
    const client = await createClient()

    await client.registerSpeaker()

    const { status } = await client.loginSpeaker()
    expect(status).toBe(200)
  })

  it('fails when already registered', async () => {
    const client = await createClient()

    await client.registerSpeaker()
    const { body } = await client.registerSpeaker({ expectedStatus: 409 })

    expect(body).toEqual({
      code: 'SPEAKER_EMAIL_ALREADY_USED',
      message: `Speaker with email ${CONCHA_ASENSIO.email} already exists`,
      type: 'SpeakerEmailAlreadyUsedError',
    })
  })

  it('login returns a refresh token', async () => {
    const client = await createClient()
    const clock = client.getClock()
    const now = clock.now()
    const expectedIat = now.toSeconds()
    const expectedExp = now.addDays(1).toSeconds()
    await client.registerSpeaker()

    const { body } = await client.loginSpeaker()

    const content = jwt.decode(body.accessToken) as JwtPayload
    expect(content.sub).toEqual(CONCHA_ASENSIO.id)
    expect(content.iat).toEqual(expectedIat)
    expect(content.exp).toEqual(expectedExp)
  })

  it('returns an error with invalid jwt in authenticated endpoint', async () => {
    const client = await createClient()
    const { status } = await client.getEvents({
      expectedStatus: 401,
      jwt: 'invalid-jwt',
    })

    expect(status).toEqual(401)
  })
})
