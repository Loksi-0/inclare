import { ROOT } from '@backend/constants'
import path from 'path'

export const uploadsUtils = {
  getFilePathByUrl: (url: string) => {
    return path.join(ROOT.PATH, ...url.split('/'))
  }
}
