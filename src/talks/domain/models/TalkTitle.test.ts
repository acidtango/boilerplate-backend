import { describe, expect, it } from 'vitest'
import { TalkTitleTooLongError } from '../errors/TalkTitleTooLongError.ts'
import { TalkTitle } from './TalkTitle.ts'

describe('TalkTitle', () => {
  it('fails if has more than 100 characters', () => {
    const textWithMoreThan100Characters = 'a'.repeat(101)

    expect(() => new TalkTitle(textWithMoreThan100Characters)).toThrowError(
      new TalkTitleTooLongError(),
    )
  })
})
