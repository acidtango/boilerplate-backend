import { BindingScopeEnum, Container } from 'inversify'
import { CreateEventEndpoint } from './events/infrastructure/controllers/CreateEventEndpoint.ts'
import { ListEventsEndpoint } from './events/infrastructure/controllers/ListEventsEndpoint.ts'
import { EventRepositoryMongo } from './events/infrastructure/repositories/EventRepositoryMongo.ts'
import { CreateEvent } from './events/use-cases/CreateEvent.ts'
import { ListEvents } from './events/use-cases/ListEvents.ts'
import { Token } from './shared/domain/services/Token.ts'
import { config } from './shared/infrastructure/config.ts'
import { createHono } from './shared/infrastructure/controllers/CreateHono.ts'
import { RequestContext } from './shared/infrastructure/controllers/middlewares/RequestContext.ts'
import { EmailSenderNoop } from './shared/infrastructure/email/EmailSenderNoop.ts'
import { DomainEventNotifierInversify } from './shared/infrastructure/events/DomainEventMapper/DomainEventNotifierInversify.js'
import { EventBusSQS } from './shared/infrastructure/events/EventBus/EventBusSQS.ts'
import { mongoModule } from './shared/infrastructure/repositories/CreateMongoClient.ts'
import { ClockDate } from './shared/infrastructure/services/clock/ClockDate.ts'
import { CryptoNode } from './shared/infrastructure/services/crypto/CryptoNode.ts'
import { JwtSignerHono } from './shared/infrastructure/services/jwt/JwtSignerHono.ts'
import { LoggerPino } from './shared/infrastructure/services/logger/LoggerPino.ts'
import { GetSpeakerEndpoint } from './speakers/infrastructure/controllers/GetSpeakerEndpoint.ts'
import { LoginSpeakerEndpoint } from './speakers/infrastructure/controllers/LoginSpeakerEndpoint.ts'
import { RegisterSpeakerEndpoint } from './speakers/infrastructure/controllers/RegisterSpeakerEndpoint.ts'
import { UpdateSpeakerProfileEndpoint } from './speakers/infrastructure/controllers/UpdateSpeakerProfileEndpoint.ts'
import { SpeakerRepositoryMongo } from './speakers/infrastructure/repositories/SepakerRepositoryMongo.ts'
import { GetSpeaker } from './speakers/use-cases/GetSpeaker.ts'
import { LoginSpeaker } from './speakers/use-cases/LoginSpeaker.ts'
import { RegisterSpeaker } from './speakers/use-cases/RegisterSpeaker.ts'
import { UpdateSpeakerProfile } from './speakers/use-cases/UpdateSpeakerProfile.ts'
import { ApproveTalkEndpoint } from './talks/infrastructure/controllers/ApproveTalkEndpoint.ts'
import { GetTalkEndpoint } from './talks/infrastructure/controllers/GetTalkEndpoint.ts'
import { ProposeTalkEndpoint } from './talks/infrastructure/controllers/ProposeTalkEndpoint.ts'
import { ReviewTalkEndpoint } from './talks/infrastructure/controllers/ReviewTalkEndpoint.ts'
import { TalkRepositoryMongo } from './talks/infrastructure/repositories/TalkRepositoryMongo.ts'
import { ApproveTalk } from './talks/use-cases/ApproveTalk.ts'
import { GetTalk } from './talks/use-cases/GetTalk.ts'
import { ProposeTalk } from './talks/use-cases/ProposeTalk.ts'
import { ReviewTalk } from './talks/use-cases/ReviewTalk.ts'
import { TalkProposedSubscriber } from './talks/use-cases/subscribers/TalkProposedSubscriber.ts'

export const container = new Container({ defaultScope: BindingScopeEnum.Singleton })

// Use Cases
container.bind(RegisterSpeaker).toDynamicValue(RegisterSpeaker.create)
container.bind(LoginSpeaker).toDynamicValue(LoginSpeaker.create)
container.bind(UpdateSpeakerProfile).toDynamicValue(UpdateSpeakerProfile.create)
container.bind(GetSpeaker).toDynamicValue(GetSpeaker.create)

container.bind(CreateEvent).toDynamicValue(CreateEvent.create)
container.bind(ListEvents).toDynamicValue(ListEvents.create)

container.bind(ProposeTalk).toDynamicValue(ProposeTalk.create)
container.bind(GetTalk).toDynamicValue(GetTalk.create)
container.bind(ReviewTalk).toDynamicValue(ReviewTalk.create)
container.bind(ApproveTalk).toDynamicValue(ApproveTalk.create)

// Controllers
container.bind(Token.ENDPOINT).toConstantValue(CreateEventEndpoint)
container.bind(Token.ENDPOINT).toConstantValue(ListEventsEndpoint)
container.bind(Token.ENDPOINT).toConstantValue(RegisterSpeakerEndpoint)
container.bind(Token.ENDPOINT).toConstantValue(LoginSpeakerEndpoint)
container.bind(Token.ENDPOINT).toConstantValue(UpdateSpeakerProfileEndpoint)
container.bind(Token.ENDPOINT).toConstantValue(GetSpeakerEndpoint)
container.bind(Token.ENDPOINT).toConstantValue(ProposeTalkEndpoint)
container.bind(Token.ENDPOINT).toConstantValue(GetTalkEndpoint)
container.bind(Token.ENDPOINT).toConstantValue(ReviewTalkEndpoint)
container.bind(Token.ENDPOINT).toConstantValue(ApproveTalkEndpoint)

// Subscribers
container.bind(Token.SUBSCRIBER).toDynamicValue(TalkProposedSubscriber.create)

// Repositories
container.bind(Token.SPEAKER_REPOSITORY).toDynamicValue(SpeakerRepositoryMongo.create)
container.bind(Token.EVENT_REPOSITORY).toDynamicValue(EventRepositoryMongo.create)
container.bind(Token.TALK_REPOSITORY).toDynamicValue(TalkRepositoryMongo.create)

// Services
container.bind(Token.CRYPTO).toConstantValue(new CryptoNode())
container.bind(Token.CLOCK).toConstantValue(new ClockDate())
container
  .bind<EventBusSQS>(Token.EVENT_BUS)
  .toDynamicValue(EventBusSQS.create)
  .onActivation(EventBusSQS.onActivation)
container.bind(Token.EMAIL_SENDER).toConstantValue(new EmailSenderNoop())
container.bind(Token.DOMAIN_EVENT_NOTIFIER).toDynamicValue(DomainEventNotifierInversify.create)
container.bind(Token.LOGGER).toDynamicValue(LoggerPino.create)
container.bind(Token.JWT_SIGNER).toConstantValue(new JwtSignerHono())

// Libraries
container.load(mongoModule)
container.bind(Token.SQS_CONFIG).toConstantValue(config.aws)

// Hono
container.bind(Token.APP).toDynamicValue(createHono)
container.bind(RequestContext).toConstantValue(new RequestContext())
