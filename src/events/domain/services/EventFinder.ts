import { DomainService } from '../../../shared/domain/models/hex/DomainService.ts'
import type { EventId } from '../../../shared/domain/models/ids/EventId.ts'
import { TalkEventNotFoundError } from '../errors/TalkEventNotFoundError.ts'
import type { EventRepository } from '../repositories/EventRepository.ts'

export class EventFinder extends DomainService {
  private readonly eventRepository: EventRepository

  constructor(eventRepository: EventRepository) {
    super()
    this.eventRepository = eventRepository
  }

  async ensureExists(id: EventId) {
    if (!(await this.eventRepository.exists(id))) {
      throw new TalkEventNotFoundError(id)
    }
  }
}
