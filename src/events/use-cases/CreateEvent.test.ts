import { beforeEach, describe, expect, it } from 'vitest'
import { EventRepositoryFake } from '../../../test/fakes/EventRepositoryFake.ts'
import { jsdayEvent, jsdayId } from '../../../test/mother/EventMother/JsDay.ts'
import { EventId } from '../../shared/domain/models/ids/EventId.ts'
import { JSDAY_CANARIAS } from '../../shared/infrastructure/fixtures/events.ts'
import { EventAlreadyCreatedError } from '../domain/errors/EventAlreadyCreatedError.ts'
import { EventDateRange } from '../domain/models/EventDateRange.ts'
import { EventName } from '../domain/models/EventName.ts'
import { EventProposalsDateRange } from '../domain/models/EventProposalsDateRange.ts'
import { CreateEvent, type CreateEventParams } from './CreateEvent.ts'

describe('CreateEvent', () => {
  let eventRepository: EventRepositoryFake
  let createEventUseCase: CreateEvent

  beforeEach(() => {
    eventRepository = EventRepositoryFake.empty()
    createEventUseCase = new CreateEvent(eventRepository)
  })

  it('saves the event in the repository', async () => {
    const params = createJsdayParams()

    await createEventUseCase.execute(params)

    eventRepository.expectSaveToHaveBeenCalled()
  })

  it('fails if event already exists', async () => {
    await eventRepository.save(jsdayEvent())
    const params = createJsdayParams()

    const result = createEventUseCase.execute(params)

    await expect(result).rejects.toThrowError(new EventAlreadyCreatedError(jsdayId()))
  })
})

function createJsdayParams(): CreateEventParams {
  return {
    id: new EventId(JSDAY_CANARIAS.id),
    name: new EventName(JSDAY_CANARIAS.name),
    dateRange: new EventDateRange(JSDAY_CANARIAS.startDate, JSDAY_CANARIAS.endDate),
    proposalsDateRange: new EventProposalsDateRange(
      JSDAY_CANARIAS.proposalsStartDate,
      JSDAY_CANARIAS.proposalsDeadlineDate,
    ),
  }
}
