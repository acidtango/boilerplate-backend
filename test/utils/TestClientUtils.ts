import type { Container } from 'inversify'
import { Token } from '../../src/shared/domain/services/Token.ts'
import { TestClient } from './TestClient.ts'

export class TestClientUtils extends TestClient {
  public static async create(container: Container) {
    return new TestClientUtils(await container.getAsync(Token.APP), container)
  }

  /**
   * Add here utils method that chain several calls
   * For example:
   * 1. Register an user
   * 2. Validate the email
   * 3. Establish a password
   *
   * This consists of several TestClient calls
   */

  async createConcha() {
    await this.registerSpeaker()
    await this.updateProfile()
  }

  async createJsDayCanarias() {
    await this.createEvent()
  }
}
