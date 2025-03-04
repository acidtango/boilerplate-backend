import { DomainEvent } from '../../../shared/domain/events/DomainEvent.ts'
import { DomainEventCode } from '../../../shared/domain/events/DomainEventCode.ts'
import { DomainId } from '../../../shared/domain/models/hex/DomainId.ts'
import type { Primitives } from '../../../shared/domain/models/hex/Primitives.ts'
import { TalkId } from '../../../shared/domain/models/ids/TalkId.ts'

type TalkProposedPrimitives = Primitives<TalkProposed>

export class TalkProposed extends DomainEvent {
  public static readonly code = DomainEventCode.TALK_PROPOSED

  public readonly talkId: TalkId

  public static fromPrimitives(primitives: TalkProposedPrimitives) {
    return new TalkProposed(
      TalkId.fromPrimitives(primitives.talkId),
      new DomainId(primitives.eventId),
      new Date(primitives.occurredAt),
    )
  }

  public static emit(talkId: TalkId) {
    return new TalkProposed(talkId)
  }

  private constructor(talkId: TalkId, eventId?: DomainId, occurredAt?: Date) {
    super(DomainEventCode.TALK_PROPOSED, eventId, occurredAt)
    this.talkId = talkId
  }

  toPrimitives() {
    const commonPrimitives = DomainEvent.toPrimitives(this)

    return {
      ...commonPrimitives,
      talkId: this.talkId.toPrimitives(),
    }
  }
}
