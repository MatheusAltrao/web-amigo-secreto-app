import { auth } from '@/lib/auth'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { redirect } from 'next/navigation'
import { signOutAction } from '@/actions/auth/sign-out-action'
import { Button } from '../ui/button'

export default async function Perfil() {
  const session = await auth()

  if (!session?.user) {
    redirect('/')
  }

  return (
    <form action={signOutAction}>
      <Button variant={'outline'} className="flex items-center gap-2 w-full">
        <Avatar className="size-6 ">
          <AvatarImage src={session.user?.image || ''} />
          <AvatarFallback className="flex items-center justify-center bg-primary size-6 pt-[2px] ">
            <div>
              <span>{session.user?.name?.[0]}</span>
            </div>
          </AvatarFallback>
        </Avatar>

        <p className="text-xs"> {session.user?.name} </p>
      </Button>
    </form>
  )
}
