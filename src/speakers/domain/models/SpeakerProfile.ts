import type { Language } from '../../../shared/domain/models/Language.ts'
import type { Primitives } from '../../../shared/domain/models/hex/Primitives.ts'
import { SpeakerAge } from './SpeakerAge.ts'
import { SpeakerName } from './SpeakerName.ts'

export type SpeakerProfilePrimitives = Primitives<SpeakerProfile>

export class SpeakerProfile {
  static fromPrimitives(primitives: SpeakerProfilePrimitives) {
    return new SpeakerProfile(
      SpeakerName.fromPrimitives(primitives.name),
      SpeakerAge.fromPrimitives(primitives.age),
      primitives.language,
    )
  }

  public readonly name: SpeakerName

  public readonly age: SpeakerAge

  public readonly language: Language

  constructor(name: SpeakerName, age: SpeakerAge, language: Language) {
    this.language = language
    this.age = age
    this.name = name
  }

  has(value: SpeakerName | SpeakerAge | Language) {
    if (value instanceof SpeakerName) {
      return this.name.equalsTo(value)
    }

    if (value instanceof SpeakerAge) {
      return this.age.equalsTo(value)
    }

    return this.language === value
  }

  toPrimitives() {
    return {
      name: this.name.toPrimitives(),
      age: this.age.toPrimitives(),
      language: this.language,
    }
  }
}
