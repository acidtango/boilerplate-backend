import { TalkRepositoryFake } from '../../../../test/fakes/TalkRepositoryFake'
import { createApiTalk, createApiTalkId } from '../../../../test/mother/TalkMother'
import { FRAN } from '../../../shared/fixtures/organizers'
import { TalkStatus } from '../domain/TalkStatus'
import { TalkCannotBeApprovedError } from '../domain/errors/TalkCannotBeApprovedError'
import { ApproveTalk } from './ApproveTalk'
import { TalkNotFoundError } from '../domain/errors/TalkNotFoundError'

describe('ApproveTalk', () => {
  it('approves the talk', async () => {
    const talk = createApiTalk()
    talk.setReviewerId(FRAN.id)
    const talkRepository = TalkRepositoryFake.createWith(talk)
    const approveTalk = new ApproveTalk(talkRepository)

    await approveTalk.execute(createApiTalkId())

    const savedTalk = talkRepository.getLatestSavedTalk()
    expect(savedTalk.getCurrentStatus() === TalkStatus.APPROVED).toBe(true)
  })

  it('fails if the talk is in PROPOSAL', async () => {
    const talkRepository = TalkRepositoryFake.createWithApiTalk()
    const approveTalk = new ApproveTalk(talkRepository)

    await expect(() => approveTalk.execute(createApiTalkId())).rejects.toThrowError(
      new TalkCannotBeApprovedError()
    )
  })

  it('fails if the talk does not exist', async () => {
    const notExistentId = 'not-existent-id'
    const talkRepository = TalkRepositoryFake.empty()
    const expectedError = new TalkNotFoundError(notExistentId)
    const approveTalk = new ApproveTalk(talkRepository)

    await expect(() => approveTalk.execute(notExistentId)).rejects.toThrowError(expectedError)
  })
})
