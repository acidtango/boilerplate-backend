import { EmailAddress } from '../../../src/shared/domain/models/EmailAddress.ts'
import { PlainPassword } from '../../../src/shared/domain/models/PlainPassword.ts'
import { SpeakerId } from '../../../src/shared/domain/models/ids/SpeakerId.ts'
import { CONCHA_ASENSIO } from '../../../src/shared/infrastructure/fixtures/speakers.ts'
import { Speaker } from '../../../src/speakers/domain/models/Speaker.ts'
import { SpeakerAge } from '../../../src/speakers/domain/models/SpeakerAge.ts'
import { SpeakerName } from '../../../src/speakers/domain/models/SpeakerName.ts'
import { exampleSalt, flushDomainEvents } from '../Common.ts'

export function conchaId() {
  return new SpeakerId(CONCHA_ASENSIO.id)
}

export function conchaPassword() {
  return new PlainPassword(CONCHA_ASENSIO.password)
}

export function conchaEmail() {
  return new EmailAddress(CONCHA_ASENSIO.email)
}

export function conchaSpeakerWithoutProfile({ id = conchaId(), email = conchaEmail() } = {}) {
  const speaker = Speaker.register(id, email, conchaPassword(), exampleSalt())

  return flushDomainEvents(speaker)
}

export function conchaName() {
  return new SpeakerName(CONCHA_ASENSIO.name)
}

export function conchaAge() {
  return new SpeakerAge(CONCHA_ASENSIO.age)
}

export function conchaLanguage() {
  return CONCHA_ASENSIO.language
}

export function conchaSpeaker({ id = conchaId(), email = conchaEmail() } = {}) {
  const speaker = conchaSpeakerWithoutProfile({ id, email })

  speaker.updateProfile(conchaName(), conchaAge(), conchaLanguage())

  return flushDomainEvents(speaker)
}
