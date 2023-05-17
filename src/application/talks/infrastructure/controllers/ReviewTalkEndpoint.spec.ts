import { API_TALK } from '../../../../shared/fixtures/talks'
import { ReviewTalkEndpoint } from './ReviewTalkEndpoint'
import { FRAN } from '../../../../shared/fixtures/organizers'
import { ReviewTalk, ReviewTalkParams } from '../../use-cases/ReviewTalk'
import { ReviewTalkRequestDTO } from './dtos/ReviewTalkRequestDTO'
import { OrganizerId } from '../../../../shared/domain/ids/OrganizerId'
import { TalkId } from '../../../../shared/domain/ids/TalkId'

describe('ReviewTalkEndpoint', () => {
  it('transforms DTO into domain objects', async () => {
    const reviewTalk = { execute: jest.fn() } as unknown as ReviewTalk
    const endpoint = new ReviewTalkEndpoint(reviewTalk)
    const reviewTalkDTO = ReviewTalkRequestDTO.create({
      reviewerId: FRAN.id,
    })

    await endpoint.execute(API_TALK.id, reviewTalkDTO)

    const expectedParams: ReviewTalkParams = {
      talkId: TalkId.fromPrimitives(API_TALK.id),
      reviewerId: OrganizerId.fromPrimitives(FRAN.id),
    }
    expect(reviewTalk.execute).toHaveBeenCalledWith(expectedParams)
  })
})
