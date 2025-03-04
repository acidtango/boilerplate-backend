import { config } from '../../src/shared/infrastructure/config.ts'
import type { MongoOptions } from '../../src/shared/infrastructure/repositories/CreateMongoClient.ts'

export const testMongoOptions = {
  ...config.db,
  database: `test-${process.env.VITEST_POOL_ID}`,
} satisfies MongoOptions
