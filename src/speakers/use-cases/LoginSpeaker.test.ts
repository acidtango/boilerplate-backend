import * as jwt from 'jsonwebtoken'
import { beforeEach, describe, expect, it } from 'vitest'
import { CONCHA_ASENSIO } from '../../shared/infrastructure/fixtures/speakers.ts'
import { ClockFake } from '../../shared/infrastructure/services/clock/ClockFake.ts'
import { LoginSpeaker } from './LoginSpeaker.ts'
import { SpeakerRepositoryFake } from '../../../test/fakes/SpeakerRepositoryFake.ts'
import { PlainPassword } from '../../shared/domain/models/PlainPassword.ts'
import { InvalidCredentialsError } from '../domain/errors/InvalidCredentialsError.ts'
import type { JwtPayload } from '../../auth/domain/JwtPayload.ts'
import { Role } from '../../shared/domain/models/Role.ts'
import { conchaEmail, conchaPassword } from '../../../test/mother/SpeakerMother/Concha.ts'
import { notImportantPassword } from '../../../test/mother/SpeakerMother/NotImportant.ts'
import { jorgeEmail } from '../../../test/mother/SpeakerMother/Jorge.ts'
import { JwtSignerHono } from '../../shared/infrastructure/services/jwt/JwtSignerHono.ts'

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

    const content = jwt.decode(accessToken) as JwtPayload
    expect(content.sub).toEqual(CONCHA_ASENSIO.id)
    expect(content.iat).toEqual(expectedIat)
    expect(content.exp).toEqual(expectedExp)
    expect(content.role).toEqual(Role.SPEAKER)
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
