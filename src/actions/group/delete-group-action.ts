'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/firebase'
import { revalidatePath } from 'next/cache'

export async function deleteGroupAction(id: string) {
  const session = await auth()

  if (!session) {
    return
  }

  try {
    await db.collection('groups').doc(id).delete()
    revalidatePath('/groups')
    return true
  } catch (error) {
    return error
  }
}
