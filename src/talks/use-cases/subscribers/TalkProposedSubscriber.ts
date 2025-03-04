import type { interfaces } from 'inversify'
import type { DomainEvent } from '../../../shared/domain/events/DomainEvent.ts'
import { DomainEventSubscriber } from '../../../shared/domain/events/DomainEventSubscriber.ts'
import {
  type EmailSender,
  ThanksForTheProposal,
} from '../../../shared/domain/services/EmailSender.ts'
import { Token } from '../../../shared/domain/services/Token.ts'
import type { SpeakerRepository } from '../../../speakers/domain/repositories/SpeakerRepository.ts'
import { SpeakerFinder } from '../../../speakers/domain/services/SpeakerFinder.ts'
import { TalkProposed } from '../../domain/events/TalkProposed.ts'
import type { TalkRepository } from '../../domain/repositories/TalkRepository.ts'
import { TalkFinder } from '../../domain/services/TalkFinder.ts'

export class TalkProposedSubscriber extends DomainEventSubscriber<TalkProposed> {
  private readonly talkFinder: TalkFinder

  private readonly speakerFinder: SpeakerFinder

  private readonly emailSender: EmailSender

  public static async create({ container }: interfaces.Context) {
    return new TalkProposedSubscriber(
      ...(await Promise.all([
        container.getAsync<EmailSender>(Token.EMAIL_SENDER),
        container.getAsync<TalkRepository>(Token.TALK_REPOSITORY),
        container.getAsync<SpeakerRepository>(Token.SPEAKER_REPOSITORY),
      ])),
    )
  }

  constructor(
    emailSender: EmailSender,
    talkRepository: TalkRepository,
    speakerRepository: SpeakerRepository,
  ) {
    super()
    this.emailSender = emailSender
    this.talkFinder = new TalkFinder(talkRepository)
    this.speakerFinder = new SpeakerFinder(speakerRepository)
  }

  canHandle(domainEvent: DomainEvent): boolean {
    return domainEvent instanceof TalkProposed
  }

  async on({ talkId }: TalkProposed) {
    const talk = await this.talkFinder.findOrThrowBy(talkId)
    const speaker = await this.speakerFinder.findOrThrowBy(talk.getSpeakerId())

    const email = new ThanksForTheProposal(speaker)

    await this.emailSender.sendThanksForProposal(email)
  }
}
