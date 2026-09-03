import { stringSchema } from '../shared/stringSchema'
import z from 'zod'

export const upload = z.instanceof(FormData)
export const uploadContents = z.object({
  file: z.instanceof(File),
  postId: stringSchema(),
  order: z.coerce.number()
})
export type UploadContents = z.infer<typeof uploadContents>
