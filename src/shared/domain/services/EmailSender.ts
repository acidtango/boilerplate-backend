import type { Speaker } from '../../../speakers/domain/models/Speaker.ts'

export class ThanksForTheProposal {
  private readonly speaker: Speaker

  constructor(speaker: Speaker) {
    this.speaker = speaker
  }
}

export interface EmailSender {
  sendThanksForProposal(email: ThanksForTheProposal): Promise<void>
}
