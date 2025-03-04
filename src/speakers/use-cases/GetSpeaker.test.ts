import { beforeEach, describe, expect, it } from 'vitest'
import { SpeakerRepositoryFake } from '../../../test/fakes/SpeakerRepositoryFake.ts'
import { conchaId } from '../../../test/mother/SpeakerMother/Concha.ts'
import { nonExistingSpeakerId } from '../../../test/mother/SpeakerMother/NotImportant.ts'
import { SpeakerNotFoundError } from '../domain/errors/SpeakerNotFoundError.ts'
import { GetSpeaker } from './GetSpeaker.ts'

describe('GetSpeaker', () => {
  let speakerRepository: SpeakerRepositoryFake
  let getSpeakerUseCase: GetSpeaker

  beforeEach(() => {
    speakerRepository = SpeakerRepositoryFake.createWithConcha()
    getSpeakerUseCase = new GetSpeaker(speakerRepository)
  })

  it('returns the speaker by id', async () => {
    const expectedSpeakerId = conchaId()

    const speaker = await getSpeakerUseCase.execute(expectedSpeakerId)

    const expectedSpeaker = speakerRepository.getLatestSavedSpeaker()
    expect(speaker).toEqual(expectedSpeaker)
  })

  it('fails if the speaker does not exist', async () => {
    const notExistentId = nonExistingSpeakerId()

    const result = getSpeakerUseCase.execute(notExistentId)

    await expect(result).rejects.toThrowError(new SpeakerNotFoundError(notExistentId))
  })
})
