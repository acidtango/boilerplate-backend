import { applyDecorators, HttpCode } from '@nestjs/common'
import {
  ApiOperation,
  ApiResponse,
  ApiResponseMetadata,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger'
import { Public } from './Public'

export enum DocumentationTag {
  HEALTH = 'Health',
  EVENTS = 'Events',
  SPEAKERS = 'Speakers',
  TALKS = 'Talks',
}

export type Options = {
  tag: DocumentationTag
  isPublic?: boolean
}
export type EndpointOptions = ApiResponseMetadata & Options

export function Endpoint(options: EndpointOptions) {
  if (options.status && typeof options.status === 'number') {
    const { description, isPublic, ...remainingOptions } = options
    const decorators = [
      ApiOperation({ summary: description }),
      ApiResponse(remainingOptions),
      HttpCode(options.status),
      ApiTags(options.tag),
    ]

    if (isPublic) return applyDecorators(...decorators, Public())

    return applyDecorators(...decorators, ApiSecurity('basic-auth'))
  }

  return applyDecorators(ApiResponse(options), ApiTags(options.tag), ApiSecurity('basic-auth'))
}
