import { Speaker } from '../../src/speakers/domain/models/Speaker.ts'
import { SpeakerRepositoryMemory } from '../../src/speakers/infrastructure/repositories/SpeakerRepositoryMemory.ts'
import { conchaSpeaker, conchaSpeakerWithoutProfile } from '../mother/SpeakerMother/Concha.ts'

export class SpeakerRepositoryFake extends SpeakerRepositoryMemory {
  static empty() {
    return new SpeakerRepositoryFake()
  }

  static with(...speakers: Speaker[]) {
    const speakerRepository = new SpeakerRepositoryFake()

    for (const speaker of speakers) {
      speakerRepository.saveSync(speaker)
    }

    return speakerRepository
  }

  static createWithConcha(): SpeakerRepositoryFake {
    const speaker = conchaSpeaker()

    return SpeakerRepositoryFake.with(speaker)
  }

  static createWithConchaWithoutProfile(): SpeakerRepositoryFake {
    const speaker = conchaSpeakerWithoutProfile()

    return SpeakerRepositoryFake.with(speaker)
  }

  getLatestSavedSpeaker(): Speaker {
    const speakers = Array.from(this.speakers.values())
    const lastSpeaker = speakers[speakers.length - 1]
    if (!lastSpeaker) throw new Error('No speaker found')
    return Speaker.fromPrimitives(lastSpeaker)
  }
}
