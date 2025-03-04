import { expect } from 'vitest'
import type {
  EmailSender,
  ThanksForTheProposal,
} from '../../src/shared/domain/services/EmailSender.ts'
import type { Reseteable } from '../../src/shared/infrastructure/repositories/Reseteable.ts'

export class EmailSenderFake implements EmailSender, Reseteable {
  private sendThanksForProposalCalled = false

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async sendThanksForProposal(email: ThanksForTheProposal): Promise<void> {
    this.sendThanksForProposalCalled = true
  }

  expectSendThanksForProposalSent(): void {
    expect(this.sendThanksForProposalCalled).toBe(true)
  }

  async reset(): Promise<void> {
    this.sendThanksForProposalCalled = false
  }
}
