import { DomainErrorCode } from '../../domain/errors/DomainErrorCode.ts'

const HttpStatus = {
  BAD_REQUEST: 400,
  CONFLICT: 409,
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
} as const

type HttpStatus = (typeof HttpStatus)[keyof typeof HttpStatus]

export const domainErrorToHttpStatusCode: Record<DomainErrorCode, HttpStatus> = {
  [DomainErrorCode.AGGREGATE_ALREADY_CREATED_ERROR]: HttpStatus.CONFLICT,
  [DomainErrorCode.INVALID_DATE_RANGE]: HttpStatus.BAD_REQUEST,
  [DomainErrorCode.MAXIMUM_COSPEAKERS_REACHED]: HttpStatus.BAD_REQUEST,
  [DomainErrorCode.SPEAKER_DOES_NOT_EXISTS]: HttpStatus.NOT_FOUND,
  [DomainErrorCode.TALK_ALREADY_BEING_REVIEWED]: HttpStatus.BAD_REQUEST,
  [DomainErrorCode.TALK_CANNOT_BE_APPROVED]: HttpStatus.BAD_REQUEST,
  [DomainErrorCode.TALK_DESCRIPTION_TOO_LONG]: HttpStatus.BAD_REQUEST,
  [DomainErrorCode.TALK_DOES_NOT_EXISTS]: HttpStatus.NOT_FOUND,
  [DomainErrorCode.TALK_EVENT_NOT_FOUND]: HttpStatus.NOT_FOUND,
  [DomainErrorCode.TALK_TITLE_TOO_LONG]: HttpStatus.BAD_REQUEST,
  [DomainErrorCode.UNDERAGE_SPEAKER]: HttpStatus.BAD_REQUEST,
  [DomainErrorCode.SPEAKER_EMAIL_ALREADY_USED]: HttpStatus.CONFLICT,
  [DomainErrorCode.INVALID_LOGIN_CREDENTIALS]: HttpStatus.UNAUTHORIZED,
  [DomainErrorCode.PROFILE_NOT_FILLED]: HttpStatus.BAD_REQUEST,
}
