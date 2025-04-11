import { describe, expect, it } from 'vitest'
import { JSDAY_CANARIAS } from '../../../src/shared/infrastructure/fixtures/events.ts'
import { createClient } from '../../utils/TestClient.ts'

describe('create event', () => {
  it('can be created', async () => {
    const client = await createClient()

    await client.createEvent()

    await expect(client.getEvents()).resolves.hasBody([
      {
        id: JSDAY_CANARIAS.id,
        name: JSDAY_CANARIAS.name,
        dateRange: {
          startDate: JSDAY_CANARIAS.startDate.toISOString(),
          endDate: JSDAY_CANARIAS.endDate.toISOString(),
        },
        proposalsDateRange: {
          startDate: JSDAY_CANARIAS.proposalsStartDate.toISOString(),
          deadline: JSDAY_CANARIAS.proposalsDeadlineDate.toISOString(),
        },
      },
    ])
  })
})
