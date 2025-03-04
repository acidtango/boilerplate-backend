import { type ZodType, z as zod } from 'zod'
import { extendZodWithOpenApi } from 'zod-openapi'

extendZodWithOpenApi(zod)

export const z = zod

export type infer<T extends ZodType> = zod.infer<T>
