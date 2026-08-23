import UserPage from '@/widgets/user'

type Params = Promise<{ uuid: string }>

const User = async ({ params }: { params: Params }) => {
  const { uuid } = await params

  return <UserPage uuid={uuid} />
}

export default User
