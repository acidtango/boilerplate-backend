import { beforeEach, describe, expect, it } from 'vitest'
import { EventBusFake } from '../../../test/fakes/EventBusFake.ts'
import { TalkRepositoryFake } from '../../../test/fakes/TalkRepositoryFake.ts'
import { dailosId } from '../../../test/mother/OrganizerMother/Dailos.ts'
import { notImportantOrganizerId } from '../../../test/mother/OrganizerMother/NotImportant.ts'
import { improvingTestsId } from '../../../test/mother/TalkMother/ImprovingTests.ts'
import { juniorXpId } from '../../../test/mother/TalkMother/JuniorXp.ts'
import { TalkAlreadyBeingReviewed } from '../domain/errors/TalkAlreadyBeingReviewed.ts'
import { TalkNotFoundError } from '../domain/errors/TalkNotFoundError.ts'
import { TalkAssignedForReview } from '../domain/events/TalkAssignedForReview.ts'
import { ReviewTalk } from './ReviewTalk.ts'

describe('ReviewTalk', () => {
  let eventBus: EventBusFake
  let talkRepository: TalkRepositoryFake
  let reviewTalk: ReviewTalk

  beforeEach(() => {
    eventBus = new EventBusFake()
    talkRepository = TalkRepositoryFake.createWithJuniorXp()
    reviewTalk = new ReviewTalk(eventBus, talkRepository)
  })

  it('assigns the talk to a reviewer', async () => {
    const talkId = juniorXpId()
    const reviewerId = dailosId()

    await reviewTalk.execute({ talkId, reviewerId })

    const savedTalk = talkRepository.getLatestSavedTalk()
    expect(savedTalk.isGoingToBeReviewedBy(reviewerId)).toBe(true)
  })

  it('event should be emitted', async () => {
    const talkId = juniorXpId()
    const reviewerId = dailosId()

    await reviewTalk.execute({ talkId, reviewerId })

    eventBus.expectLastEventToBe(new TalkAssignedForReview(talkId, reviewerId))
  })

  it('fails if talk does not exist', async () => {
    const talkId = improvingTestsId()

    const result = reviewTalk.execute({
      talkId,
      reviewerId: notImportantOrganizerId(),
    })

    await expect(result).rejects.toThrowError(new TalkNotFoundError(talkId))
  })

  it('fails if talk is already being reviewed', async () => {
    const talkId = juniorXpId()
    const reviewerId = dailosId()
    await reviewTalk.execute({ talkId, reviewerId })

    const result = reviewTalk.execute({ talkId, reviewerId })

    await expect(result).rejects.toThrowError(new TalkAlreadyBeingReviewed(talkId))
  })
})
