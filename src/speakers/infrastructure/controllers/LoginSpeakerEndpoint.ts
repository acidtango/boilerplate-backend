import { describeRoute } from 'hono-openapi'
import { resolver, validator } from 'hono-openapi/zod'
import { EmailAddress } from '../../../shared/domain/models/EmailAddress.ts'
import { PlainPassword } from '../../../shared/domain/models/PlainPassword.ts'
import { type Endpoint, factory } from '../../../shared/infrastructure/controllers/factory.ts'
import { ApiTag } from '../../../shared/infrastructure/controllers/schemas/ApiTag.ts'
import { LoginSpeaker } from '../../use-cases/LoginSpeaker.ts'
import { LoginSpeakerRequestDTO } from './dtos/LoginSpeakerRequestDTO.ts'
import { LoginSpeakerResponseDTO } from './dtos/LoginSpeakerResponseDTO.ts'

export const LoginSpeakerEndpoint = {
  method: 'post' as const,
  path: '/api/v1/speakers/login',
  secured: false,
  handlers: factory.createHandlers(
    describeRoute({
      summary: 'Authenticate speaker',
      description:
        'Allows a speaker to log in by providing their email and password. Returns an access token upon successful authentication.',
      tags: [ApiTag.SPEAKERS],
      responses: {
        200: {
          description: 'Speaker logged in',
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
    },
  ),
} satisfies Endpoint
