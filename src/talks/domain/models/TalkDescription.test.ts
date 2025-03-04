import { describe, expect, it } from 'vitest'
import { TalkDescriptionTooLongError } from '../errors/TalkDescriptionTooLongError.ts'
import { TalkDescription } from './TalkDescription.ts'

describe('TalkDescription', () => {
  it('fails if has more than 300 characters', () => {
    const textWithMoreThan300Characters = 'a'.repeat(1001)

    expect(() => new TalkDescription(textWithMoreThan300Characters)).toThrowError(
      new TalkDescriptionTooLongError(),
    )
  })
})
