import type { interfaces } from 'inversify'
import type { EmailAddress } from '../../shared/domain/models/EmailAddress.ts'
import type { PlainPassword } from '../../shared/domain/models/PlainPassword.ts'
import type { EventBus } from '../../shared/domain/models/hex/EventBus.ts'
import type { SpeakerId } from '../../shared/domain/models/ids/SpeakerId.ts'
import type { Crypto } from '../../shared/domain/services/Crypto.ts'
import { Token } from '../../shared/domain/services/Token.ts'
import { SpeakerAlreadyCreatedError } from '../domain/errors/SpeakerAlreadyCreatedError.ts'
import { SpeakerEmailAlreadyUsedError } from '../domain/errors/SpeakerEmailAlreadyUsedError.ts'
import { Speaker } from '../domain/models/Speaker.ts'
import type { SpeakerRepository } from '../domain/repositories/SpeakerRepository.ts'

export type RegisterSpeakerParams = {
  id: SpeakerId
  email: EmailAddress
  password: PlainPassword
}

export class RegisterSpeaker {
  public static async create({ container }: interfaces.Context) {
    return new RegisterSpeaker(
      ...(await Promise.all([
        container.getAsync<SpeakerRepository>(Token.SPEAKER_REPOSITORY),
        container.getAsync<Crypto>(Token.CRYPTO),
        container.getAsync<EventBus>(Token.EVENT_BUS),
      ])),
    )
  }

  private readonly speakerRepository: SpeakerRepository

  private readonly crypto: Crypto

  private readonly eventBus: EventBus

  constructor(speakerRepository: SpeakerRepository, crypto: Crypto, eventBus: EventBus) {
    this.eventBus = eventBus
    this.crypto = crypto
    this.speakerRepository = speakerRepository
  }

  async execute({ email, id, password }: RegisterSpeakerParams): Promise<void> {
    await this.ensureSpeakerWithEmailDoesNotAlreadyExists(email)
    await this.ensureIdIsNotAlreadyUsed(id)

    const speaker = Speaker.register(id, email, password, await this.crypto.generateSalt())

    await this.speakerRepository.save(speaker)
    await this.eventBus.publish(speaker.pullDomainEvents())
  }

  private async ensureIdIsNotAlreadyUsed(id: SpeakerId) {
    if (await this.speakerRepository.exists(id)) {
      throw new SpeakerAlreadyCreatedError(id)
    }
  }

  private async ensureSpeakerWithEmailDoesNotAlreadyExists(email: EmailAddress) {
    if (await this.speakerRepository.existsWith(email)) {
      throw new SpeakerEmailAlreadyUsedError(email)
    }
  }
}
