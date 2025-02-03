'use server'
import FormCreateGroup from './components/form-create-group'
import { auth } from '@/lib/auth'
import Container from '@/components/commons/container'

export default async function GroupPage() {
  const session = await auth()

  if (!session?.user) {
    return
  }

  return (
    <Container>
      <FormCreateGroup
        userName={session.user?.name || ''}
        userEmail={session.user?.email || ''}
      />
    </Container>
  )
}
