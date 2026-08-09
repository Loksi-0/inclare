import { ROOT } from '@backend/constants'
import path from 'path'

export const getFilePathByUrl = (url: string) => {
  return path.join(ROOT.PATH, ...url.split('/'))
}
