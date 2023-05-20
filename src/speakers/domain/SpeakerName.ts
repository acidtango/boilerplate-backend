import { ValueObject } from '../../shared/domain/models/hex/ValueObject'

export class SpeakerName extends ValueObject {
  constructor(private readonly name: string) {
    super()
  }

  static fromPrimitives(name: string): SpeakerName {
    return new SpeakerName(name)
  }

  toPrimitives() {
    return this.name
  }
}
