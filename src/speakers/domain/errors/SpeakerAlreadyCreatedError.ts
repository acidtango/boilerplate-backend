import { AggregateAlreadyCreatedError } from '../../../shared/domain/errors/AggregateAlreadyCreatedError.ts'
import type { SpeakerId } from '../../../shared/domain/models/ids/SpeakerId.ts'
import { Speaker } from '../models/Speaker.ts'

export class SpeakerAlreadyCreatedError extends AggregateAlreadyCreatedError {
  constructor(speakerId: SpeakerId) {
    super(speakerId, Speaker.name)
  }
}
