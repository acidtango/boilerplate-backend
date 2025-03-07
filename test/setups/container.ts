import { container as prodContainer } from '../../src/container.ts'
import { EventRepositoryMemory } from '../../src/events/infrastructure/repositories/EventRepositoryMemory.ts'
import { Token } from '../../src/shared/domain/services/Token.ts'
import { config } from '../../src/shared/infrastructure/config.ts'
import { EventBusMemory } from '../../src/shared/infrastructure/events/EventBus/EventBusMemory.ts'
import { LoggerDummy } from '../../src/shared/infrastructure/services/logger/LoggerDummy.ts'
import { SpeakerRepositoryMemory } from '../../src/speakers/infrastructure/repositories/SpeakerRepositoryMemory.ts'
import { TalkRepositoryMemory } from '../../src/talks/infrastructure/repositories/TalkRepositoryMemory.ts'
import { EmailSenderFake } from '../fakes/EmailSenderFake.ts'
import { testMongoOptions } from './testMongoOptions.ts'
import { testSQSOptions } from './testSQSOptions.ts'

prodContainer.rebind(Token.DB_CONFIG).toConstantValue(testMongoOptions)
prodContainer.rebind(Token.SQS_CONFIG).toConstantValue(testSQSOptions)
prodContainer.rebind(Token.EMAIL_SENDER).toConstantValue(new EmailSenderFake())
prodContainer.rebind(Token.LOGGER).toConstantValue(new LoggerDummy())

if (!config.forceEnableORMRepositories) {
  prodContainer.rebind(Token.EVENT_REPOSITORY).toDynamicValue(EventRepositoryMemory.create)
  prodContainer.rebind(Token.SPEAKER_REPOSITORY).toDynamicValue(SpeakerRepositoryMemory.create)
  prodContainer.rebind(Token.TALK_REPOSITORY).toDynamicValue(TalkRepositoryMemory.create)
  prodContainer.rebind(Token.EVENT_BUS).toDynamicValue(EventBusMemory.create)
}

export const container = prodContainer
