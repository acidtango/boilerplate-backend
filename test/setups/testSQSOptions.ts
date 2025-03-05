import { config } from '../../src/shared/infrastructure/config.ts'
import type { SQSConfig } from '../../src/shared/infrastructure/events/EventBus/EventBusSQS.ts'

const queueName = `test-${process.env.VITEST_POOL_ID}`

export const testSQSOptions = {
  ...config.aws,
  sqs: {
    ...config.aws.sqs,
    url: config.aws.sqs.url.replace('localstack-queue', queueName),
  },
} satisfies SQSConfig
