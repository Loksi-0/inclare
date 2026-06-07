import { isValidObjectId } from 'mongoose'
import * as z from 'zod'

const objectIdSchema = z.string().refine((val) => isValidObjectId(val), {
  message: 'Невалидный формат ObjectId'
})

export default objectIdSchema
