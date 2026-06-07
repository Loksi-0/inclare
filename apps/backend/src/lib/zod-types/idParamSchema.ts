import z from 'zod'
import objectIdSchema from './objectIdSchema.js'

const idParamSchema = z.object({
  id: objectIdSchema
})

export default idParamSchema
