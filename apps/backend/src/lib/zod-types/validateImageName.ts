import type z from 'zod'

const validateImageName = (
  data: Record<string, unknown>,
  ctx: z.core.$RefinementCtx<typeof data>
) => {
  if (data.image && !data.imageName) {
    ctx.addIssue({
      code: 'custom',
      message: 'При отправке изображения необходимо указать его название',
      path: ['imageName']
    })
  }
}

export default validateImageName
