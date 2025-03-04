import { describeRoute } from 'hono-openapi'
import { resolver, validator } from 'hono-openapi/zod'
import { LoginSpeakerRequestDTO } from './dtos/LoginSpeakerRequestDTO.ts'
import { LoginSpeakerResponseDTO } from './dtos/LoginSpeakerResponseDTO.ts'
import { EmailAddress } from '../../../shared/domain/models/EmailAddress.ts'
import { PlainPassword } from '../../../shared/domain/models/PlainPassword.ts'
import { LoginSpeaker } from '../../use-cases/LoginSpeaker.ts'
import { type Endpoint, factory } from '../../../shared/infrastructure/controllers/factory.ts'

export const LoginSpeakerEndpoint = {
  method: 'post' as const,
  path: '/api/v1/speakers/login',
  secured: false,
  handlers: factory.createHandlers(
    describeRoute({
      description: 'Login a speaker to get the auth tokens',
      tags: ['Speakers'],
      responses: {
        201: {
          description: 'Speaker registered',
          content: {
            'application/json': {
              schema: resolver(LoginSpeakerResponseDTO),
            },
          },
        },
      },
    }),
    validator('json', LoginSpeakerRequestDTO),
    async (c) => {
      const loginSpeaker = await c.var.container.getAsync(LoginSpeaker)
      const body = c.req.valid('json')
      const email = EmailAddress.fromPrimitives(body.email)
      const password = PlainPassword.fromPrimitives(body.password)

      const accessToken = await loginSpeaker.execute({ email, password })

      return c.json({ accessToken }, 200)
    }
  ),
} satisfies Endpoint
