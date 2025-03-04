import type { interfaces } from 'inversify'
import type { JwtPayload } from '../../auth/domain/JwtPayload.ts'
import type { EmailAddress } from '../../shared/domain/models/EmailAddress.ts'
import type { PlainPassword } from '../../shared/domain/models/PlainPassword.ts'
import { Role } from '../../shared/domain/models/Role.ts'
import type { Clock } from '../../shared/domain/services/Clock.ts'
import type { JwtSigner } from '../../shared/domain/services/JwtSigner.ts'
import { Token } from '../../shared/domain/services/Token.ts'
import { config } from '../../shared/infrastructure/config.ts'
import { InvalidCredentialsError } from '../domain/errors/InvalidCredentialsError.ts'
import type { Speaker } from '../domain/models/Speaker.ts'
import type { SpeakerRepository } from '../domain/repositories/SpeakerRepository.ts'

export type LoginSpeakerParams = {
  email: EmailAddress
  password: PlainPassword
}

export class LoginSpeaker {
  static async create({ container }: interfaces.Context) {
    return new LoginSpeaker(
      await container.getAsync(Token.SPEAKER_REPOSITORY),
      container.get(Token.CLOCK),
      container.get(Token.JWT_SIGNER),
    )
  }
  private readonly speakerRepository: SpeakerRepository

  private readonly clock: Clock

  private readonly jwtSigner: JwtSigner

  constructor(speakerRepository: SpeakerRepository, clock: Clock, jwtSigner: JwtSigner) {
    this.clock = clock
    this.speakerRepository = speakerRepository
    this.jwtSigner = jwtSigner
  }

  async execute({ email, password }: LoginSpeakerParams): Promise<string> {
    const speaker = await this.speakerRepository.findBy(email)

    if (!speaker) {
      throw new InvalidCredentialsError()
    }

    if (speaker.doesNotHaveMatching(password)) {
      throw new InvalidCredentialsError()
    }

    return await this.createAccessToken(speaker)
  }

  private async createAccessToken(speaker: Speaker) {
    const now = this.clock.now()
    const nowInSeconds = now.toSeconds()
    const tomorrow = now.addDays(1)
    const tomorrowInSeconds = tomorrow.toSeconds()

    const payload: JwtPayload = {
      iat: nowInSeconds,
      sub: speaker.getIdAsString(),
      exp: tomorrowInSeconds,
      role: Role.SPEAKER,
    }

    return await this.jwtSigner.sign(payload, config.jwt.secret)
  }
}
