import { describeRoute } from 'hono-openapi'
import { validator } from 'hono-openapi/zod'
import { EventId } from '../../../shared/domain/models/ids/EventId.ts'
import { type Endpoint, factory } from '../../../shared/infrastructure/controllers/factory.ts'
import { ApiTag } from '../../../shared/infrastructure/controllers/schemas/ApiTag.ts'
import { EventDateRange } from '../../domain/models/EventDateRange.ts'
import { EventName } from '../../domain/models/EventName.ts'
import { EventProposalsDateRange } from '../../domain/models/EventProposalsDateRange.ts'
import { CreateEvent } from '../../use-cases/CreateEvent.ts'
import { CreateEventRequestDTO } from './dtos/CreateEventRequestDTO.ts'

export const CreateEventEndpoint = {
  method: 'post' as const,
  path: '/api/v1/events',
  handlers: factory.createHandlers(
    describeRoute({
      summary: 'Create a new event',
      description:
        'This endpoint allows the user to create a new event in the Codetalk platform. An event represents a conference, meetup, or similar gathering where sessions can be scheduled, and speakers can participate. The user provides the event details, including its name, date, location, and other relevant information. Upon successful creation, the API returns the details of the newly created event.',
      tags: [ApiTag.EVENTS],
      security: [{ bearerAuth: [] }],
      responses: {
        201: {
          description: 'The event was successfully created',
        },
      },
    }),
    validator('json', CreateEventRequestDTO),
    async (c) => {
      const createEvent = await c.var.container.getAsync(CreateEvent)
      const body = c.req.valid('json')
      const id = EventId.fromPrimitives(body.id)
      const name = EventName.fromPrimitives(body.name)
      const dateRange = EventDateRange.fromPrimitives(body.dateRange)
      const proposalsDateRange = EventProposalsDateRange.fromPrimitives(body.proposalsDateRange)
      await createEvent.execute({
        id,
        name,
        dateRange,
        proposalsDateRange,
      })
      return c.body(null, 201)
    },
  ),
} satisfies Endpoint
