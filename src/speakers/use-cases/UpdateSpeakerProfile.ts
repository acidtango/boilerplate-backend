import type { interfaces } from 'inversify'
import type { Language } from '../../shared/domain/models/Language.ts'
import type { EventBus } from '../../shared/domain/models/hex/EventBus.ts'
import { UseCase } from '../../shared/domain/models/hex/UseCase.ts'
import type { SpeakerId } from '../../shared/domain/models/ids/SpeakerId.ts'
import { Token } from '../../shared/domain/services/Token.ts'
import type { SpeakerAge } from '../domain/models/SpeakerAge.ts'
import type { SpeakerName } from '../domain/models/SpeakerName.ts'
import type { SpeakerRepository } from '../domain/repositories/SpeakerRepository.ts'
import { SpeakerFinder } from '../domain/services/SpeakerFinder.ts'

export type UpdateSpeakerProfileParams = {
  id: SpeakerId
  name: SpeakerName
  age: SpeakerAge
  language: Language
}

export class UpdateSpeakerProfile extends UseCase {
  public static async create({ container }: interfaces.Context) {
    return new UpdateSpeakerProfile(
      ...(await Promise.all([
        container.getAsync<SpeakerRepository>(Token.SPEAKER_REPOSITORY),
        container.getAsync<EventBus>(Token.EVENT_BUS),
      ])),
    )
  }

  private readonly speakerFinder: SpeakerFinder

  private readonly speakerRepository: SpeakerRepository

  private readonly eventBus: EventBus

  constructor(speakerRepository: SpeakerRepository, eventBus: EventBus) {
    super()
    this.eventBus = eventBus
    this.speakerRepository = speakerRepository
    this.speakerFinder = new SpeakerFinder(speakerRepository)
  }

  async execute({ id, name, age, language }: UpdateSpeakerProfileParams) {
    const speaker = await this.speakerFinder.findOrThrowBy(id)

    speaker.updateProfile(name, age, language)

    await this.speakerRepository.save(speaker)
    await this.eventBus.publish(speaker.pullDomainEvents())
  }
}
