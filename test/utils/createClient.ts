import { container } from '../setups/container.ts'
import { TestClientUtils } from './TestClientUtils.ts'

export async function createClient() {
  return TestClientUtils.create(container)
}
