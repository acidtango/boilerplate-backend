import type { Language } from '../../../shared/domain/models/Language.ts'
import { AggregateRoot } from '../../../shared/domain/models/hex/AggregateRoot.ts'
import type { Primitives } from '../../../shared/domain/models/hex/Primitives.ts'
import { EventId } from '../../../shared/domain/models/ids/EventId.ts'
import { OrganizerId } from '../../../shared/domain/models/ids/OrganizerId.ts'
import { SpeakerId } from '../../../shared/domain/models/ids/SpeakerId.ts'
import { TalkId } from '../../../shared/domain/models/ids/TalkId.ts'
import { MaximumCospeakersReachedError } from '../errors/MaximumCospeakersReachedError.ts'
import { TalkAlreadyBeingReviewed } from '../errors/TalkAlreadyBeingReviewed.ts'
import { TalkCannotBeApprovedError } from '../errors/TalkCannotBeApprovedError.ts'
import { TalkAssignedForReview } from '../events/TalkAssignedForReview.ts'
import { TalkProposed } from '../events/TalkProposed.ts'
import { TalkDescription } from './TalkDescription.ts'
import { TalkStatus } from './TalkStatus.ts'
import { TalkTitle } from './TalkTitle.ts'

export type TalkPrimitives = Primitives<Talk>

export class Talk extends AggregateRoot {
  private readonly id: TalkId
  private readonly title: TalkTitle
  private readonly description: TalkDescription
  private readonly language: Language
  private readonly cospeakers: SpeakerId[]
  private readonly speakerId: SpeakerId
  private readonly eventId: EventId
  private reviewerId?: OrganizerId
  private isApproved?: boolean

  static fromPrimitives(talkPrimitives: TalkPrimitives) {
    const {
      id,
      cospeakers,
      description,
      eventId,
      language,
      speakerId,
      title,
      reviewerId,
      isApproved,
    } = talkPrimitives

    return new Talk(
      TalkId.fromPrimitives(id),
      TalkTitle.fromPrimitives(title),
      TalkDescription.fromPrimitives(description),
      language,
      cospeakers.map(SpeakerId.fromPrimitives),
      SpeakerId.fromPrimitives(speakerId),
      EventId.fromPrimitives(eventId),
      reviewerId ? OrganizerId.fromPrimitives(reviewerId) : undefined,
      typeof isApproved === 'boolean' ? isApproved : undefined,
    )
  }

  static proposal(
    id: TalkId,
    title: TalkTitle,
    description: TalkDescription,
    language: Language,
    cospeakers: SpeakerId[],
    speakerId: SpeakerId,
    eventId: EventId,
  ) {
    const talk = new Talk(id, title, description, language, cospeakers, speakerId, eventId)

    talk.recordEvent(TalkProposed.emit(id))

    return talk
  }

  private constructor(
    id: TalkId,
    title: TalkTitle,
    description: TalkDescription,
    language: Language,
    cospeakers: SpeakerId[],
    speakerId: SpeakerId,
    eventId: EventId,
    reviewerId?: OrganizerId,
    isApproved?: boolean,
  ) {
    super()
    this.id = id
    this.title = title
    this.description = description
    this.language = language
    this.cospeakers = cospeakers
    this.speakerId = speakerId
    this.eventId = eventId
    this.reviewerId = reviewerId
    this.isApproved = isApproved
    if (cospeakers.length >= 4) throw new MaximumCospeakersReachedError()
  }

  hasStatus(expectedStatus: TalkStatus) {
    return this.getCurrentStatus() === expectedStatus
  }

  assignForReviewTo(reviewerId: OrganizerId) {
    this.ensureTalkIsNotAlreadyBeingReviewed()
    this.reviewerId = reviewerId
    this.recordEvent(new TalkAssignedForReview(this.id, reviewerId))
  }

  isGoingToBeReviewedBy(expectedReviewerId: OrganizerId) {
    return this.reviewerId?.equals(expectedReviewerId) ?? false
  }

  ensureTalkIsNotAlreadyBeingReviewed() {
    if (this.hasStatus(TalkStatus.REVIEWING)) {
      throw new TalkAlreadyBeingReviewed(this.id)
    }
  }

  private getCurrentStatus() {
    if (this.isApproved) return TalkStatus.APPROVED
    if (this.isApproved === false) return TalkStatus.REJECTED
    if (this.reviewerId) return TalkStatus.REVIEWING

    return TalkStatus.PROPOSAL
  }

  approve() {
    if (this.hasStatus(TalkStatus.PROPOSAL)) throw new TalkCannotBeApprovedError(this.id)

    this.isApproved = true
  }

  getSpeakerId() {
    return this.speakerId
  }

  toPrimitives() {
    return {
      id: this.id.toPrimitives(),
      title: this.title.toPrimitives(),
      description: this.description.toPrimitives(),
      language: this.language,
      cospeakers: this.cospeakers.map(SpeakerId.toPrimitives),
      status: this.getCurrentStatus(),
      speakerId: this.speakerId.toPrimitives(),
      reviewerId: this.reviewerId?.toPrimitives(),
      eventId: this.eventId.toPrimitives(),
      isApproved: this.isApproved,
    }
  }
}
