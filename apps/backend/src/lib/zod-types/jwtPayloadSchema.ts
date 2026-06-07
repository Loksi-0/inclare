import z from 'zod'
import objectIdSchema from './objectIdSchema.js'

const jwtPayloadSchema = z.object({
  userId: objectIdSchema,
  role: z.literal(['user', 'manager', 'admin'], 'Неверная роль пользователя')
})

export default jwtPayloadSchema
