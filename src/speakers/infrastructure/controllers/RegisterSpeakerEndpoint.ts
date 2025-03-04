import { RegisterSpeaker } from '../../use-cases/RegisterSpeaker.ts'
import { RegisterSpeakerRequestDTO } from './dtos/RegisterSpeakerRequestDTO.ts'
import { EmailAddress } from '../../../shared/domain/models/EmailAddress.ts'
import { SpeakerId } from '../../../shared/domain/models/ids/SpeakerId.ts'
import { PlainPassword } from '../../../shared/domain/models/PlainPassword.ts'
import { type Endpoint, factory } from '../../../shared/infrastructure/controllers/factory.ts'
import { describeRoute } from 'hono-openapi'
import { validator } from 'hono-openapi/zod'

export const RegisterSpeakerEndpoint = {
  method: 'post',
  path: '/api/v1/speakers/registration',
  secured: false,
  handlers: factory.createHandlers(
    describeRoute({
      description: 'Creates an event',
      tags: ['Speakers'],
      responses: {
        201: {
          description: 'Speaker registered',
        },
      },
    }),
    validator('json', RegisterSpeakerRequestDTO),
    async (c) => {
      const registerSpeaker = await c.var.container.getAsync(RegisterSpeaker)

      const body = c.req.valid('json')
      await registerSpeaker.execute({
        id: SpeakerId.fromPrimitives(body.id),
        email: EmailAddress.fromPrimitives(body.email),
        password: PlainPassword.fromPrimitives(body.password),
      })
      return c.body(null, 201)
    }
  ),
} satisfies Endpoint
