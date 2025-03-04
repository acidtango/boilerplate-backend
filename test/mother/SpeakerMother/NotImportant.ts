import { EmailAddress } from '../../../src/shared/domain/models/EmailAddress.ts'
import { PlainPassword } from '../../../src/shared/domain/models/PlainPassword.ts'
import { SpeakerId } from '../../../src/shared/domain/models/ids/SpeakerId.ts'
import { NOT_IMPORTANT_SPEAKER } from '../../../src/shared/infrastructure/fixtures/speakers.ts'
import { SpeakerAge } from '../../../src/speakers/domain/models/SpeakerAge.ts'
import { SpeakerName } from '../../../src/speakers/domain/models/SpeakerName.ts'

export function notImportantSpeakerId() {
  return new SpeakerId(NOT_IMPORTANT_SPEAKER.id)
}

export function notImportantEmail() {
  return new EmailAddress(NOT_IMPORTANT_SPEAKER.email)
}

export function notImportantName() {
  return new SpeakerName(NOT_IMPORTANT_SPEAKER.name)
}

export function notImportantAge() {
  return new SpeakerAge(NOT_IMPORTANT_SPEAKER.age)
}

export function notImportantLanguage() {
  return NOT_IMPORTANT_SPEAKER.language
}

export function notImportantPassword() {
  return new PlainPassword(NOT_IMPORTANT_SPEAKER.password)
}

export function nonExistingSpeakerId() {
  return new SpeakerId(NOT_IMPORTANT_SPEAKER.id)
}
