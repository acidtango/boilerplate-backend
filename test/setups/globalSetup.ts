import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest'
import { container } from './container.ts'
import { Token } from '../../src/shared/domain/services/Token.ts'
import type { Reseteable } from '../../src/shared/infrastructure/repositories/Reseteable.ts'
import type { Closable } from '../../src/shared/infrastructure/repositories/Closable.ts'
import { EventBusMemory } from '../../src/shared/infrastructure/events/EventBus/EventBusMemory.ts'

let repos = [] as (Closable & Reseteable)[]

function isNotE2E(fileName: string) {
  return !fileName.match(/e2e/)
}

beforeAll(async (context) => {
  if (isNotE2E(context.name)) {
    return
  }
  console.log('beforeAll')
  repos = await Promise.all([
    container.getAsync<Closable & Reseteable>(Token.EVENT_REPOSITORY),
    container.getAsync<Closable & Reseteable>(Token.SPEAKER_REPOSITORY),
    container.getAsync<Closable & Reseteable>(Token.TALK_REPOSITORY),
  ])
})

beforeEach(async (context) => {
  if (isNotE2E(context.task.file.name)) {
    return
  }
  console.log('beforeEach', context.task.file.name)
  await Promise.all(repos.map((repo) => repo.reset()))
})

afterEach(async (context) => {
  if (isNotE2E(context.task.file.name)) {
    return
  }
  console.log('afterEach', context.task.file.name)
  const eventBus = await container.getAsync<EventBusMemory>(Token.EVENT_BUS)
  await eventBus.waitForEvents()
})

afterAll(async (context) => {
  if (isNotE2E(context.name)) {
    return
  }
  console.log('afterAll')
  for (const repo of repos) {
    await repo.close()
  }
})
