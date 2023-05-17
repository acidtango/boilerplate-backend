import { Talk } from './Talk'
import { TalkId } from '../../../shared/domain/ids/TalkId'

export interface TalkRepository {
  save(talk: Talk): Promise<void>
  findBy(talkId: TalkId): Promise<Talk | undefined>
}
