import type { Hono } from 'hono'
import type { Container } from 'inversify'
import { MongoClient } from 'mongodb'
import { expect } from 'vitest'
import type { Clock } from '../../src/shared/domain/services/Clock.ts'
import { Token } from '../../src/shared/domain/services/Token.ts'
import type { EventBusMemory } from '../../src/shared/infrastructure/events/EventBus/EventBusMemory.ts'
import { JSDAY_CANARIAS } from '../../src/shared/infrastructure/fixtures/events.ts'
import { DAILOS } from '../../src/shared/infrastructure/fixtures/organizers.ts'
import { CONCHA_ASENSIO } from '../../src/shared/infrastructure/fixtures/speakers.ts'
import { JUNIOR_XP } from '../../src/shared/infrastructure/fixtures/talks.ts'
import {
  type Reseteable,
  isReseteable,
} from '../../src/shared/infrastructure/repositories/Reseteable.ts'
import type { EmailSenderFake } from '../fakes/EmailSenderFake.ts'
import { container } from '../setups/container.ts'

export class TestClient {
  public readonly container: Container
  private app: Hono

  public static async create(container: Container) {
    return new TestClient(await container.getAsync(Token.APP), container)
  }

  constructor(app: Hono, container: Container) {
    this.app = app
    this.container = container
  }

  getClock() {
    return this.container.get<Clock>(Token.CLOCK)
  }

  getEmailSender() {
    return this.container.get<EmailSenderFake>(Token.EMAIL_SENDER)
  }

  async reset() {
    const repositories = await Promise.all([
      this.container.getAsync<Reseteable>(Token.SPEAKER_REPOSITORY),
      this.container.getAsync<Reseteable>(Token.EVENT_REPOSITORY),
      this.container.getAsync<Reseteable>(Token.TALK_REPOSITORY),
    ]).then((repositories) => repositories.filter(isReseteable))

    for (const repository of repositories) {
      await repository.reset()
    }
  }

  async waitForAllEvents() {
    const eventBus = await this.container.getAsync<EventBusMemory>(Token.EVENT_BUS)
    await eventBus.waitForEvents()
  }

  async close() {
    const mongoClient = this.container.get(MongoClient)
    await mongoClient.close()
  }

  async registerSpeaker({ expectedStatus = 201 } = {}) {
    const res = await this.app.request('/api/v1/speakers/registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: CONCHA_ASENSIO.id,
        email: CONCHA_ASENSIO.email,
        password: CONCHA_ASENSIO.password,
      }),
    })
    expect(res.status).toBe(expectedStatus)
    return {
      status: res.status,
      res,
      body: res.status === 201 ? null : await res.json(),
    }
  }

  async loginSpeaker() {
    const res = await this.app.request('/api/v1/speakers/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: CONCHA_ASENSIO.email,
        password: CONCHA_ASENSIO.password,
      }),
    })
    expect(res.status).toBe(200)
    return {
      status: res.status,
      body: await res.json(),
      res,
    }
  }

  async updateProfile({ id = CONCHA_ASENSIO.id, jwt = CONCHA_ASENSIO.jwt } = {}) {
    const res = await this.app.request(`/api/v1/speakers/${id}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        name: CONCHA_ASENSIO.name,
        age: CONCHA_ASENSIO.age,
        language: CONCHA_ASENSIO.language,
      }),
    })
    expect(res.status).toBe(200)
    return {
      status: res.status,
      res,
    }
  }

  async getSpeaker({ id = CONCHA_ASENSIO.id, jwt = CONCHA_ASENSIO.jwt } = {}) {
    const res = await this.app.request(`/api/v1/speakers/${id}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    expect(res.status).toBe(200)
    return {
      status: res.status,
      body: await res.json(),
      res,
    }
  }

  async createEvent({ jwt = DAILOS.jwt } = {}) {
    const res = await this.app.request('/api/v1/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        id: JSDAY_CANARIAS.id,
        name: JSDAY_CANARIAS.name,
        dateRange: {
          startDate: JSDAY_CANARIAS.startDate,
          endDate: JSDAY_CANARIAS.endDate,
        },
        proposalsDateRange: {
          startDate: JSDAY_CANARIAS.proposalsStartDate,
          deadline: JSDAY_CANARIAS.proposalsDeadlineDate,
        },
      }),
    })
    expect(res.status).toBe(201)
    return {
      status: res.status,
      res,
    }
  }

  async getEvents({ expectedStatus = 200, jwt = CONCHA_ASENSIO.jwt } = {}) {
    const res = await this.app.request('/api/v1/events', {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    expect(res.status).toBe(expectedStatus)
    return {
      status: res.status,
      body: res.status === 200 ? await res.json() : await res.text(),
      res,
    }
  }

  async getTalk(id = JUNIOR_XP.id, jwt = CONCHA_ASENSIO.jwt) {
    const res = await this.app.request(`/api/v1/talks/${id}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    expect(res.status).toBe(200)
    return {
      status: res.status,
      body: await res.json(),
      res,
    }
  }

  async proposeTalk({ id = JUNIOR_XP.id, jwt = CONCHA_ASENSIO.jwt } = {}) {
    const res = await this.app.request('/api/v1/talks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        id,
        title: JUNIOR_XP.title,
        description: JUNIOR_XP.description,
        language: JUNIOR_XP.language,
        cospeakers: JUNIOR_XP.cospeakers,
        speakerId: CONCHA_ASENSIO.id,
        eventId: JSDAY_CANARIAS.id,
      }),
    })
    expect(res.status).toBe(201)
    return {
      status: res.status,
      res,
    }
  }

  async assignReviewer({ id = JUNIOR_XP.id, reviewerId = DAILOS.id, jwt = DAILOS.jwt } = {}) {
    const res = await this.app.request(`/api/v1/talks/${id}/assignation`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        reviewerId,
      }),
    })
    expect(res.status).toBe(200)
    return {
      status: res.status,
      res,
    }
  }

  async approveTalk({ id = JUNIOR_XP.id, jwt = DAILOS.jwt } = {}) {
    const res = await this.app.request(`/api/v1/talks/${id}/approve`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        isApproved: true,
      }),
    })
    expect(res.status).toBe(200)
    return {
      status: res.status,
      res,
    }
  }
}

export async function createClient() {
  return TestClient.create(container)
}
