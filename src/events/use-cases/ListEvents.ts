import type { interfaces } from 'inversify'
import { UseCase } from '../../shared/domain/models/hex/UseCase.ts'
import { TalkEvent } from '../domain/models/TalkEvent.ts'
import type { EventRepository } from '../domain/repositories/EventRepository.ts'
import { Token } from '../../shared/domain/services/Token.ts'
import type { Logger } from '../../shared/domain/services/Logger.ts'

export class ListEvents extends UseCase {
  public static async create({ container }: interfaces.Context) {
    return new ListEvents(
      await container.getAsync(Token.EVENT_REPOSITORY),
      container.get(Token.LOGGER)
    )
  }

  private readonly eventRepository: EventRepository

  private readonly logger: Logger

  constructor(eventRepository: EventRepository, logger: Logger) {
    super()
    this.eventRepository = eventRepository
    this.logger = logger
  }

  async execute(): Promise<TalkEvent[]> {
    this.logger.info('eseeeeeeeeee')
    return this.eventRepository.findAll()
  }
}
