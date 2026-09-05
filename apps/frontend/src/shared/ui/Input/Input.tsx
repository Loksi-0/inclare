import AvatarInput from './Avatar/Avatar'
import FileInput from './File/File'
import NumberInput from './Number/Number'
import PasswordInput from './Password/Password'
import TextInput from './Text/Text'
import Textarea from './Textarea/Textarea'

const Input = {
  Text: TextInput,
  Number: NumberInput,
  Password: PasswordInput,
  Textarea: Textarea,
  Avatar: AvatarInput,
  File: FileInput
}

export default Input
