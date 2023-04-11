import { DateRangeDTO } from './DateRangeDTO'
import { ProposalDateRangeDTO as ProposalDateRangeDTO } from './ProposalDateRangeDTO'
import { IsString, IsUUID, ValidateNested } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { CODEMOTION } from '../../../../../shared/fixtures/events'
import { Type } from 'class-transformer'

type CreateEventRequestDTOParams = {
  id: string
  name: string
  dateRange: DateRangeDTO
  proposalsDateRange: ProposalDateRangeDTO
}

export class CreateEventRequestDTO {
  @ApiProperty({ example: CODEMOTION.id })
  @IsUUID()
  id!: string

  @ApiProperty({ example: CODEMOTION.name })
  @IsString()
  name!: string

  @ApiProperty()
  @Type(() => DateRangeDTO)
  @ValidateNested()
  dateRange!: DateRangeDTO

  @ApiProperty()
  @Type(() => ProposalDateRangeDTO)
  @ValidateNested()
  proposalsDateRange!: ProposalDateRangeDTO

  static create(params: CreateEventRequestDTOParams) {
    const createEventRequestDTO = new CreateEventRequestDTO()
    createEventRequestDTO.id = params.id
    createEventRequestDTO.name = params.name
    createEventRequestDTO.dateRange = params.dateRange
    createEventRequestDTO.proposalsDateRange = params.proposalsDateRange
    return createEventRequestDTO
  }
}
