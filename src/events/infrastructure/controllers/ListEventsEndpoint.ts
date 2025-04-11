import { describeRoute } from 'hono-openapi'
import { resolver } from 'hono-openapi/zod'
import { type Endpoint, factory } from '../../../shared/infrastructure/controllers/factory.ts'
import { ApiTag } from '../../../shared/infrastructure/controllers/schemas/ApiTag.ts'
import { z } from '../../../shared/infrastructure/controllers/zod.ts'
import { ListEvents } from '../../use-cases/ListEvents.ts'
import { EventResponseDTO } from './dtos/EventResponseDTO.ts'

export const ListEventsEndpoint = {
  method: 'get' as const,
  path: '/api/v1/events',
  handlers: factory.createHandlers(
    describeRoute({
      summary: 'List all events',
      description:
        'Retrieves a list of all events available in the Codetalk platform. Each event includes details such as name, date range, and proposal submission period.',
      tags: [ApiTag.EVENTS],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Successfully retrieved event list',
          content: {
            'application/json': {
              schema: resolver(z.array(EventResponseDTO)),
            },
          },
        },
      },
    }),
    async (c) => {
      const listEvents = await c.var.container.getAsync(ListEvents)

      const events = await listEvents.execute()

      const mapped = events.map((event) => {
        const eventPrimitives = event.toPrimitives()

        return {
          id: eventPrimitives.id,
          name: eventPrimitives.name,
          dateRange: {
            startDate: eventPrimitives.dateRange.startDate.toISOString(),
            endDate: eventPrimitives.dateRange.endDate.toISOString(),
          },
          proposalsDateRange: {
            startDate: eventPrimitives.proposalsDateRange.startDate.toISOString(),
            deadline: eventPrimitives.proposalsDateRange.deadline.toISOString(),
          },
        }
      })

      return c.json(mapped, 200)
    },
  ),
} satisfies Endpoint
