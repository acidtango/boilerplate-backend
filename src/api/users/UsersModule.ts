import { Module } from '@nestjs/common'
import { UserRepositoryModule } from '../../application/users/infrastructure/repositories/UserRepositoryModule'
import { ContactsInCommonFetcher } from '../../application/users/use-cases/ContactsInCommonFetcher'
import { UserContactsUpdater } from '../../application/users/use-cases/UserContactsUpdater'
import { UserCreator } from '../../application/users/use-cases/UserCreator'
import { UserFinder } from '../../application/users/use-cases/UserFinder'
import { UsersController } from './UsersController'
import { UserCreatedSubscriber } from '../../application/users/domain/events/UserCreatedSubscriber'

@Module({
  imports: [UserRepositoryModule],
  controllers: [UsersController],
  providers: [
    UserCreator,
    UserContactsUpdater,
    UserFinder,
    ContactsInCommonFetcher,
    UserCreatedSubscriber,
  ],
})
export class UsersModule {}
