import { describe, expect, it } from 'vitest'
import { juniorXpTalk } from '../../../../test/mother/TalkMother/JuniorXp.ts'
import { OrganizerId } from '../../../shared/domain/models/ids/OrganizerId.ts'
import { DAILOS } from '../../../shared/infrastructure/fixtures/organizers.ts'
import { MaximumCospeakersReachedError } from '../errors/MaximumCospeakersReachedError.ts'
import { TalkStatus } from './TalkStatus.ts'

describe('Talk', () => {
  it('fails if cospeakers are greater than 4', () => {
    const cospeakers = [
      '51cb0a36-0d61-49e3-89a1-276af899b028',
      '30ddf8ac-fdf1-4828-9df6-a42dd4e132db',
      '10705038-d0ec-4181-be58-6aa2e282ec3e',
      'c0650351-b6aa-4ae1-9ac6-30af6f8d3778',
    ]

    expect(() => juniorXpTalk({ cospeakers })).toThrowError(new MaximumCospeakersReachedError())
  })

  it('is not assigned for review when created', () => {
    const talk = juniorXpTalk()

    const notExistentId = new OrganizerId('not-existent-id')
    expect(talk.isGoingToBeReviewedBy(notExistentId)).toBe(false)
  })

  it('has status PROPOSAL when created', () => {
    const talk = juniorXpTalk()

    expect(talk.hasStatus(TalkStatus.PROPOSAL)).toBe(true)
  })

  it('does not have status REVIEWING when created', () => {
    const talk = juniorXpTalk()

    expect(talk.hasStatus(TalkStatus.REVIEWING)).toBe(false)
  })

  it('can be assigned to a reviewer', () => {
    const talk = juniorXpTalk()
    const reviewerId = new OrganizerId(DAILOS.id)

    talk.assignForReviewTo(reviewerId)

    expect(talk.isGoingToBeReviewedBy(reviewerId)).toBe(true)
  })

  it('has status REVIEWING when assigned to a reviewer', () => {
    const talk = juniorXpTalk()
    const reviewerId = new OrganizerId(DAILOS.id)

    talk.assignForReviewTo(reviewerId)

    expect(talk.hasStatus(TalkStatus.REVIEWING)).toBe(true)
  })
})
