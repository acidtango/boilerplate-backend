import type { SQSConfig } from './events/EventBus/EventBusSQS.ts'

export const config = {
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number.parseInt(process.env.DB_PORT || '27017', 10),
    username: process.env.DB_USERNAME || 'acid',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'develop',
  },
  aws: {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'na',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'na',
    },
    region: process.env.AWS_REGION || 'eu-west-1',
    endpoint:
      process.env.AWS_ENDPOINT === 'default'
        ? undefined
        : (process.env.AWS_ENDPOINT ?? 'http://localhost:4566'),
    sqs: {
      url:
        process.env.AWS_SQS_URL ||
        'http://sqs.eu-west-1.localhost.localstack.cloud:4566/000000000000/localstack-queue',
    },
  } satisfies SQSConfig,
  logger: {
    pretty: process.env.NODE_ENV !== 'production',
    level: 'debug',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'ilovecats',
  },
  forceEnableORMRepositories: process.env.ENABLE_TEST_ORM_REPOSITORIES === 'true',
  listeningPort: Number.parseInt(process.env.APP_PORT || '8080', 10),
}
