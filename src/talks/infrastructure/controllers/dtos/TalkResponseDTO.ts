import { ApiProperty } from '@nestjs/swagger'
import { CODEMOTION } from '../../../../shared/infrastructure/fixtures/events'
import { FRAN } from '../../../../shared/infrastructure/fixtures/organizers'
import { JOYCE_LIN } from '../../../../shared/infrastructure/fixtures/speakers'
import { API_TALK } from '../../../../shared/infrastructure/fixtures/talks'
import { Language } from '../../../../shared/domain/models/Language'
import { TalkStatus } from '../../../domain/TalkStatus'

export class TalkResponseDTO {
  @ApiProperty({ example: API_TALK.id })
  id!: string

  @ApiProperty({ example: API_TALK.title })
  title!: string

  @ApiProperty({ example: API_TALK.description })
  description!: string

  @ApiProperty({ example: Language.ENGLISH, enum: Language })
  language!: Language

  @ApiProperty({ example: API_TALK.cospeakers, type: [String] })
  cospeakers!: string[]

  @ApiProperty({ example: TalkStatus.PROPOSAL, enum: TalkStatus })
  status!: TalkStatus

  @ApiProperty({ example: JOYCE_LIN.id })
  speakerId!: string

  @ApiProperty({ example: FRAN.id, nullable: true })
  reviewerId?: string

  @ApiProperty({ example: false, nullable: true })
  isApproved?: boolean

  @ApiProperty({ example: CODEMOTION.id })
  eventId!: string

  static create(params: TalkResponseDTO) {
    const talkResponseDTO = new TalkResponseDTO()

    talkResponseDTO.id = params.id
    talkResponseDTO.title = params.title
    talkResponseDTO.description = params.description
    talkResponseDTO.language = params.language
    talkResponseDTO.cospeakers = params.cospeakers
    talkResponseDTO.status = params.status
    talkResponseDTO.speakerId = params.speakerId
    talkResponseDTO.eventId = params.eventId
    talkResponseDTO.reviewerId = params.reviewerId
    talkResponseDTO.isApproved = params.isApproved

    return talkResponseDTO
  }
}
