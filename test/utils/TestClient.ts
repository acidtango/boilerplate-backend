import type { Hono } from 'hono'
import type { Container } from 'inversify'
import type { Input, KyInstance } from 'ky'
import ky from 'ky'
import type { Clock } from '../../src/shared/domain/services/Clock.ts'
import { Token } from '../../src/shared/domain/services/Token.ts'
import { JSDAY_CANARIAS } from '../../src/shared/infrastructure/fixtures/events.ts'
import { DAILOS } from '../../src/shared/infrastructure/fixtures/organizers.ts'
import { CONCHA_ASENSIO } from '../../src/shared/infrastructure/fixtures/speakers.ts'
import { JUNIOR_XP } from '../../src/shared/infrastructure/fixtures/talks.ts'
import type { LoginSpeakerResponseDTO } from '../../src/speakers/infrastructure/controllers/dtos/LoginSpeakerResponseDTO.js'
import type { EmailSenderFake } from '../fakes/EmailSenderFake.ts'
import { container } from '../setups/container.ts'

export class TestClient {
  public readonly container: Container
  private app: Hono
  private ky: KyInstance

  public static async create(container: Container) {
    return new TestClient(await container.getAsync(Token.APP), container)
  }

  constructor(app: Hono, container: Container) {
    this.app = app
    this.container = container

    this.ky = ky.extend({
      fetch: async (input: Input) => {
        if (!(input instanceof Request)) {
          throw new Error('Unimplemented method TestClient#fetch')
        }
        return input
          .clone()
          .text()
          .then(() => app.request(input))
      },
      prefixUrl: 'http://localhost',
    })
  }

  getClock() {
    return this.container.get<Clock>(Token.CLOCK)
  }

  getEmailSender() {
    return this.container.get<EmailSenderFake>(Token.EMAIL_SENDER)
  }

  async registerSpeaker() {
    return this.ky.post('api/v1/speakers/registration', {
      json: {
        id: CONCHA_ASENSIO.id,
        email: CONCHA_ASENSIO.email,
        password: CONCHA_ASENSIO.password,
      },
    })
  }

  async loginSpeaker() {
    return this.ky.post<LoginSpeakerResponseDTO>('api/v1/speakers/login', {
      json: {
        email: CONCHA_ASENSIO.email,
        password: CONCHA_ASENSIO.password,
      },
    })
  }

  async updateProfile({ id = CONCHA_ASENSIO.id, jwt = CONCHA_ASENSIO.jwt } = {}) {
    return this.ky.put(`api/v1/speakers/${id}/profile`, {
      json: {
        name: CONCHA_ASENSIO.name,
        age: CONCHA_ASENSIO.age,
        language: CONCHA_ASENSIO.language,
      },
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
  }

  async getSpeaker({ id = CONCHA_ASENSIO.id, jwt = CONCHA_ASENSIO.jwt } = {}) {
    return this.ky.get(`api/v1/speakers/${id}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
  }

  async createEvent({ jwt = DAILOS.jwt } = {}) {
    return this.ky.post('api/v1/events', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      json: {
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
      },
    })
  }

  async getEvents({ jwt = CONCHA_ASENSIO.jwt } = {}) {
    return this.ky.get('api/v1/events', {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
  }

  async getTalk(id = JUNIOR_XP.id, jwt = CONCHA_ASENSIO.jwt) {
    return this.ky.get(`api/v1/talks/${id}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
  }

  async proposeTalk({ id = JUNIOR_XP.id, jwt = CONCHA_ASENSIO.jwt } = {}) {
    return this.ky.post('api/v1/talks', {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      json: {
        id,
        title: JUNIOR_XP.title,
        description: JUNIOR_XP.description,
        language: JUNIOR_XP.language,
        cospeakers: JUNIOR_XP.cospeakers,
        speakerId: CONCHA_ASENSIO.id,
        eventId: JSDAY_CANARIAS.id,
      },
    })
  }

  async assignReviewer({ id = JUNIOR_XP.id, reviewerId = DAILOS.id, jwt = DAILOS.jwt } = {}) {
    return this.ky.put(`api/v1/talks/${id}/assignation`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      json: {
        reviewerId,
      },
    })
  }

  async approveTalk({ id = JUNIOR_XP.id, jwt = DAILOS.jwt } = {}) {
    return this.ky.put(`api/v1/talks/${id}/approve`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      json: {
        isApproved: 'true',
      },
    })
  }
}

export async function createClient() {
  return TestClient.create(container)
}
