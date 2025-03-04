import type { EmailSender, ThanksForTheProposal } from '../../domain/services/EmailSender.ts'

export class EmailSenderNoop implements EmailSender {
  async sendThanksForProposal(_email: ThanksForTheProposal): Promise<void> {}
}
