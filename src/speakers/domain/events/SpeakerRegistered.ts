import { DomainEvent } from '../../../shared/domain/events/DomainEvent.ts'
import { DomainEventCode } from '../../../shared/domain/events/DomainEventCode.ts'
import type { SpeakerId } from '../../../shared/domain/models/ids/SpeakerId.ts'

export class SpeakerRegistered extends DomainEvent {
  public readonly id: SpeakerId

  constructor(id: SpeakerId) {
    super(DomainEventCode.SPEAKER_REGISTERED)
    this.id = id
  }
}
