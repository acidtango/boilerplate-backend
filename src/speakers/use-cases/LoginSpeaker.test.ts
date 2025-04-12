import { decode } from 'hono/jwt'
import { beforeEach, describe, expect, it } from 'vitest'
import { SpeakerRepositoryFake } from '../../../test/fakes/SpeakerRepositoryFake.ts'
import { conchaEmail, conchaPassword } from '../../../test/mother/SpeakerMother/Concha.ts'
import { jorgeEmail } from '../../../test/mother/SpeakerMother/Jorge.ts'
import { notImportantPassword } from '../../../test/mother/SpeakerMother/NotImportant.ts'
import { PlainPassword } from '../../shared/domain/models/PlainPassword.ts'
import { Role } from '../../shared/domain/models/Role.ts'
import { CONCHA_ASENSIO } from '../../shared/infrastructure/fixtures/speakers.ts'
import { ClockFake } from '../../shared/infrastructure/services/clock/ClockFake.ts'
import { JwtSignerHono } from '../../shared/infrastructure/services/jwt/JwtSignerHono.ts'
import { InvalidCredentialsError } from '../domain/errors/InvalidCredentialsError.ts'
import { LoginSpeaker } from './LoginSpeaker.ts'

describe('LoginSpeaker', () => {
  let clock: ClockFake
  let speakerRepository: SpeakerRepositoryFake
  let loginSpeaker: LoginSpeaker

  beforeEach(() => {
    clock = new ClockFake()
    speakerRepository = SpeakerRepositoryFake.createWithConcha()
    loginSpeaker = new LoginSpeaker(speakerRepository, clock, new JwtSignerHono())
  })

  it('returns an access token if credentials are valid', async () => {
    const now = clock.now()
    const expectedIat = now.toSeconds()
    const expectedExp = now.addDays(1).toSeconds()

    const accessToken = await loginSpeaker.execute({
      email: conchaEmail(),
      password: conchaPassword(),
    })

    const content = decode(accessToken)
    expect(content.payload.sub).toEqual(CONCHA_ASENSIO.id)
    expect(content.payload.iat).toEqual(expectedIat)
    expect(content.payload.exp).toEqual(expectedExp)
    expect(content.payload.role).toEqual(Role.SPEAKER)
  })

  it('fails if password is incorrect', async () => {
    const result = loginSpeaker.execute({
      email: conchaEmail(),
      password: new PlainPassword('wrong password'),
    })

    await expect(result).rejects.toEqual(new InvalidCredentialsError())
  })

  it('fails if email is not found', async () => {
    const result = loginSpeaker.execute({
      email: jorgeEmail(),
      password: notImportantPassword(),
    })

    await expect(result).rejects.toEqual(new InvalidCredentialsError())
  })
})
