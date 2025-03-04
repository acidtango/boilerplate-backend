import type { interfaces } from 'inversify'
import type { SpeakerId } from '../../shared/domain/models/ids/SpeakerId.ts'
import { Token } from '../../shared/domain/services/Token.ts'
import { SpeakerNotFoundError } from '../domain/errors/SpeakerNotFoundError.ts'
import type { Speaker } from '../domain/models/Speaker.ts'
import type { SpeakerRepository } from '../domain/repositories/SpeakerRepository.ts'

export class GetSpeaker {
  public static async create({ container }: interfaces.Context) {
    return new GetSpeaker(await container.get(Token.SPEAKER_REPOSITORY))
  }

  private readonly speakerRepository: SpeakerRepository

  constructor(speakerRepository: SpeakerRepository) {
    this.speakerRepository = speakerRepository
  }

  async execute(speakerId: SpeakerId): Promise<Speaker> {
    const speaker = await this.speakerRepository.findById(speakerId)

    if (!speaker) throw new SpeakerNotFoundError(speakerId)

    return speaker
  }
}
