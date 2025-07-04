export const Token = {
  APP: 'APP',
  ENDPOINT: 'ENDPOINT',
  EVENT_REPOSITORY: 'EVENT_REPOSITORY',
  SPEAKER_REPOSITORY: 'SPEAKER_REPOSITORY',
  TALK_REPOSITORY: 'TALK_REPOSITORY',
  DOMAIN_EVENT_NOTIFIER: 'DOMAIN_EVENT_NOTIFIER',
  EVENT_BUS: 'EVENT_BUS',
  CLOCK: 'CLOCK',
  CRYPTO: 'CRYPTO',
  LOGGER: 'LOGGER',
  EMAIL_SENDER: 'EMAIL_SENDER',
  DB_CONFIG: 'DB_CONFIG',
  JWT_SIGNER: 'JWT_SIGNER',
  SQS_CONFIG: 'SQS_CONFIG',
  SUBSCRIBER: 'SUBSCRIBER',
} as const

export type Token = (typeof Token)[keyof typeof Token]
