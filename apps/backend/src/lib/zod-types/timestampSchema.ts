import z from 'zod'

const timestampSchema = z
  .number()
  .int()
  .min(1704067200000, 'Timestamp слишком старый')
  .max(2147483647000, 'Timestamp из будущего')

export default timestampSchema
