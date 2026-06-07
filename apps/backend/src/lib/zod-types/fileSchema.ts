import z from 'zod'

const fileSchema = (type: 'pdf' | 'image', maxSize: number) => {
  if (type === 'image') {
    return z
      .file('Картинка отсутствует')
      .mime(
        ['image/jpeg', 'image/png', 'image/webp'],
        'Неверный формат изображения'
      )
      .max(
        maxSize,
        `Файл слишком большой (требуется не больше ${String(Math.round(maxSize / 1_000_000))}МБ)`
      )
  }

  return z
    .file('Файл отсутствует')
    .mime('application/pdf', 'Файл может быть только формата pdf')
    .max(
      maxSize,
      `Файл слишком большой (требуется не больше ${String(Math.round(maxSize / 1_000_000))}МБ)`
    )
}

export default fileSchema
