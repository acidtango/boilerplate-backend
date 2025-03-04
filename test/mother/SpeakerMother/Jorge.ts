import { EmailAddress } from '../../../src/shared/domain/models/EmailAddress.ts'
import { PlainPassword } from '../../../src/shared/domain/models/PlainPassword.ts'
import { SpeakerId } from '../../../src/shared/domain/models/ids/SpeakerId.ts'
import { JORGE_AGUIAR } from '../../../src/shared/infrastructure/fixtures/speakers.ts'
import { Speaker } from '../../../src/speakers/domain/models/Speaker.ts'
import { exampleSalt, flushDomainEvents } from '../Common.ts'

export function jorgeId() {
  return new SpeakerId(JORGE_AGUIAR.id)
}

export function jorgeEmail() {
  return new EmailAddress(JORGE_AGUIAR.email)
}

export function jorgePassword() {
  return new PlainPassword(JORGE_AGUIAR.password)
}

export function jorgeSpeakerWithoutProfile() {
  const speaker = Speaker.register(jorgeId(), jorgeEmail(), jorgePassword(), exampleSalt())

  return flushDomainEvents(speaker)
}
