import { Inject, Injectable } from '@nestjs/common'
import { UseCase } from '../../shared/domain/models/hex/UseCase'
import { Token } from '../../shared/domain/services/Token'
import { EmailAddress } from '../../shared/domain/models/EmailAddress'
import { Language } from '../../shared/domain/models/Language'
import { Speaker } from '../domain/Speaker'
import { SpeakerAge } from '../domain/SpeakerAge'
import { SpeakerId } from '../../shared/domain/models/ids/SpeakerId'
import { SpeakerName } from '../domain/SpeakerName'
import { SpeakerRepository } from '../domain/SpeakerRepository'
import { SpeakerAlreadyCreatedError } from '../domain/errors/SpeakerAlreadyCreatedError'

export type CreateSpeakerParams = {
  id: SpeakerId
  name: SpeakerName
  age: SpeakerAge
  language: Language
  email: EmailAddress
}

@Injectable()
export class CreateSpeaker extends UseCase {
  constructor(
    @Inject(Token.SPEAKER_REPOSITORY) private readonly speakerRepository: SpeakerRepository
  ) {
    super()
  }

  async execute({ age, email, id, language, name }: CreateSpeakerParams) {
    if (await this.speakerRepository.exists(id)) {
      throw new SpeakerAlreadyCreatedError(id)
    }

    const speaker = Speaker.create(id, name, age, language, email)

    await this.speakerRepository.save(speaker)
  }
}
