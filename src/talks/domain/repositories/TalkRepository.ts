import type { TalkId } from '../../../shared/domain/models/ids/TalkId.ts'
import type { Talk } from '../models/Talk.ts'

export interface TalkRepository {
  save(talk: Talk): Promise<void>
  findBy(talkId: TalkId): Promise<Talk | undefined>
}
