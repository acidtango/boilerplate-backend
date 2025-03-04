import type { interfaces } from 'inversify'
import { type Collection, Db } from 'mongodb'
import type { EmailAddress } from '../../../shared/domain/models/EmailAddress.ts'
import type { SpeakerId } from '../../../shared/domain/models/ids/SpeakerId.ts'
import type { Closable } from '../../../shared/infrastructure/repositories/Closable.ts'
import type { Reseteable } from '../../../shared/infrastructure/repositories/Reseteable.ts'
import { Speaker, type SpeakerPrimitives } from '../../domain/models/Speaker.ts'
import type { SpeakerRepository } from '../../domain/repositories/SpeakerRepository.ts'

export class SpeakerRepositoryMongo implements SpeakerRepository, Reseteable, Closable {
  public static async create({ container }: interfaces.Context) {
    const db = await container.getAsync(Db)
    return new SpeakerRepositoryMongo(db)
  }

  private readonly speakers: Collection<SpeakerPrimitives>

  constructor(db: Db) {
    this.speakers = db.collection('speakers')
  }

  async exists(id: SpeakerId): Promise<boolean> {
    const count = await this.speakers.countDocuments({ id: id.toPrimitives() })

    return count > 0
  }

  async save(speaker: Speaker) {
    const primitives = speaker.toPrimitives()

    await this.speakers.updateOne({ id: primitives.id }, { $set: primitives }, { upsert: true })
  }

  async findById(speakerId: SpeakerId): Promise<Speaker | undefined> {
    const speakerPrimitives = await this.speakers.findOne({
      id: speakerId.toPrimitives(),
    })

    if (!speakerPrimitives) return undefined

    return Speaker.fromPrimitives(speakerPrimitives)
  }

  async existsWith(email: EmailAddress): Promise<boolean> {
    const count = await this.speakers.countDocuments({
      email: email.toPrimitives(),
    })

    return count > 0
  }

  async findBy(email: EmailAddress): Promise<Speaker | undefined> {
    const speakerPrimitives = await this.speakers.findOne({
      email: email.toPrimitives(),
    })

    if (!speakerPrimitives) return undefined

    return Speaker.fromPrimitives(speakerPrimitives)
  }

  async reset() {
    await this.speakers.deleteMany()
  }

  async close(): Promise<void> {}
}
