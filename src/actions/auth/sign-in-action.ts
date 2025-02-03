'use server'

import { auth, signIn, signOut } from '../../lib/auth'

export async function signInAction() {
  const session = await auth()

  if (!session) {
    return await signIn('google', {
      redirectTo: '/new-group',
    })
  }

  return await signOut({
    redirectTo: '/',
  })
}
