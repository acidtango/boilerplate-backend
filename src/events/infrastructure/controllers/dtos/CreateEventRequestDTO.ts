import { z } from '../../../../shared/infrastructure/controllers/zod.ts'
import { DateRangeDTO } from './DateRangeDTO.ts'
import { EventIdDTO } from './EventIdDTO.ts'
import { EventNameDTO } from './EventNameDTO.ts'
import { ProposalDateRangeDTO } from './ProposalDateRangeDTO.ts'

export const CreateEventRequestDTO = z
  .object({
    id: EventIdDTO,
    name: EventNameDTO,
    dateRange: DateRangeDTO,
    proposalsDateRange: ProposalDateRangeDTO,
  })
  .openapi({
    ref: 'CreateEventRequest',
    description:
      "Represents the structure of the request payload for creating a new event in the Codetalk platform. This includes the event's unique identifier, name, duration, and the proposal submission period",
  })
