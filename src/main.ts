import { serve } from '@hono/node-server'
import { swaggerUI } from '@hono/swagger-ui'
import { openAPISpecs } from 'hono-openapi'
import { app } from './app.ts'
import { config } from './shared/infrastructure/config.ts'

app.get('/ui', swaggerUI({ url: '/docs' }))
app.get(
  '/docs',
  openAPISpecs(app, {
    documentation: {
      info: {
        title: 'Codetalk API',
        version: '1.0.0',
        description: 'A service for managing tech talks events',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      servers: [{ url: 'http://localhost:8080', description: 'Local Server' }],
    },
  }),
)

serve(
  {
    fetch: app.fetch,
    port: config.listeningPort,
  },
  (info) => {
    const url = `http://localhost:${info.port}`
    console.log(`Server listening on ${url}`)
    console.log(`Swagger Docs available at ${url}/docs`)
    console.log(`Swagger UI available at ${url}/ui`)
  },
)
