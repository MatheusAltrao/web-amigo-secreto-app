'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/firebase'
import { GroupByUserProps } from './get-group-by-user'

export async function getReadParticipantsAction(id: string) {
  const session = await auth()

  if (!session?.user) {
    return
  }

  if (!id) {
    return
  }

  try {
    const groupDoc = await db.collection('groups').doc(id).get()
    return groupDoc.data() as GroupByUserProps
  } catch (error) {
    console.log(error)
    return null
  }
}
