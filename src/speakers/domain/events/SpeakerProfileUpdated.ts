import { DomainEvent } from '../../../shared/domain/events/DomainEvent.ts'
import { DomainEventCode } from '../../../shared/domain/events/DomainEventCode.ts'
import type { SpeakerId } from '../../../shared/domain/models/ids/SpeakerId.ts'

export class SpeakerProfileUpdated extends DomainEvent {
  private readonly speakerId: SpeakerId

  constructor(speakerId: SpeakerId) {
    super(DomainEventCode.SPEAKER_PROFILE_UPDATED)
    this.speakerId = speakerId
  }
}
