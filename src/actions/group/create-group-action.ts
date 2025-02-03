'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/firebase'
import { Timestamp } from 'firebase-admin/firestore'

export interface CreateGroupActionProps {
  userId?: string
  groupName: string
  groupDescription: string
  participants: {
    name: string
    email: string
    secretFriend?: string
  }[]
}

export async function createGroupAction({
  groupDescription,
  groupName,
  participants,
}: CreateGroupActionProps) {
  const session = await auth()

  if (!session) {
    return
  }

  const userId = session.user?.id

  if (!userId) {
    return
  }

  const createdAt = Timestamp.now().toMillis()

  try {
    const group = await db.collection('groups').add({
      userId,
      createdAt,
      description: groupDescription,
      name: groupName,
      participants,
    })

    return group.id
  } catch (error) {
    console.log(error)
    return false
  }
}
