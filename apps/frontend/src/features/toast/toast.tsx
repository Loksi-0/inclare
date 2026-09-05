import { toast as sonnerToast } from 'sonner'
import Toast from './ToastComponent'

export const toast = {
  message: (message: string) => {
    return sonnerToast.custom(
      (id) => (
        <Toast
          id={id}
          title={message}
          type='message'
        />
      ),
      {
        duration: 1000 * 12
      }
    )
  },
  error: (message: string) => {
    return sonnerToast.custom(
      (id) => (
        <Toast
          id={id}
          title={message}
          type='error'
        />
      ),
      {
        duration: 1000 * 12
      }
    )
  }
}
