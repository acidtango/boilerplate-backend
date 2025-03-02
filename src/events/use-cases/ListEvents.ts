import type { interfaces } from 'inversify'
import { UseCase } from '../../shared/domain/models/hex/UseCase.ts'
import { TalkEvent } from '../domain/models/TalkEvent.ts'
import type { EventRepository } from '../domain/repositories/EventRepository.ts'
import { Token } from '../../shared/domain/services/Token.ts'

export class ListEvents extends UseCase {
  public static async create({ container }: interfaces.Context) {
    return new ListEvents(await container.getAsync(Token.EVENT_REPOSITORY))
  }

  private readonly eventRepository: EventRepository

  constructor(eventRepository: EventRepository) {
    super()
    this.eventRepository = eventRepository
  }

  async execute(): Promise<TalkEvent[]> {
    return this.eventRepository.findAll()
  }
}
