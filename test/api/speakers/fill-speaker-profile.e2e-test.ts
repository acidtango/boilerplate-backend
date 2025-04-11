import { describe, expect, it } from 'vitest'
import { CONCHA_ASENSIO } from '../../../src/shared/infrastructure/fixtures/speakers.ts'
import { createClient } from '../../utils/TestClient.ts'

describe('fill speaker profile', () => {
  it('can fill the profile', async () => {
    const client = await createClient()
    await client.registerSpeaker()

    await client.updateProfile()

    const res = await client.getSpeaker()

    expect(res).hasBody({
      id: CONCHA_ASENSIO.id,
      email: CONCHA_ASENSIO.email,
      isEmailValidated: false,
      profile: {
        age: CONCHA_ASENSIO.age,
        language: CONCHA_ASENSIO.language,
        name: CONCHA_ASENSIO.name,
      },
    })
  })
})
