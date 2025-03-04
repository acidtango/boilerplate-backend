import { beforeEach, describe, expect, it } from 'vitest'
import { TalkRepositoryFake } from '../../../test/fakes/TalkRepositoryFake.ts'
import {
  improvingTestsId,
  improvingTestsTalk,
} from '../../../test/mother/TalkMother/ImprovingTests.ts'
import { juniorXpId, juniorXpTalkReviewed } from '../../../test/mother/TalkMother/JuniorXp.ts'
import { nonExistingTalkId } from '../../../test/mother/TalkMother/NotExistent.ts'
import { TalkCannotBeApprovedError } from '../domain/errors/TalkCannotBeApprovedError.ts'
import { TalkNotFoundError } from '../domain/errors/TalkNotFoundError.ts'
import { TalkStatus } from '../domain/models/TalkStatus.ts'
import { ApproveTalk } from './ApproveTalk.ts'

describe('ApproveTalk', () => {
  let talkRepository: TalkRepositoryFake
  let approveTalk: ApproveTalk

  beforeEach(() => {
    talkRepository = TalkRepositoryFake.createWith(juniorXpTalkReviewed(), improvingTestsTalk())
    approveTalk = new ApproveTalk(talkRepository)
  })

  it('approves the talk', async () => {
    await approveTalk.execute(juniorXpId())

    const savedTalk = await talkRepository.getJuniorXpTalk()
    expect(savedTalk.hasStatus(TalkStatus.APPROVED)).toBe(true)
  })

  it('fails if the talk is in PROPOSAL', async () => {
    const talkId = improvingTestsId()

    const result = approveTalk.execute(talkId)

    await expect(result).rejects.toThrowError(new TalkCannotBeApprovedError(talkId))
  })

  it('fails if the talk does not exist', async () => {
    const talkId = nonExistingTalkId()

    const result = approveTalk.execute(talkId)

    await expect(result).rejects.toThrowError(new TalkNotFoundError(talkId))
  })
})
