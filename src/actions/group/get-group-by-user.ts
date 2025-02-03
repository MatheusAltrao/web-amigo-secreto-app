'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/firebase'

export interface GroupByUserProps {
  id: string
  userId: string
  createdAt: number
  description: string
  name: string
  participants: {
    name: string
    email: string
  }[]
}

export async function getGroupByUserAction() {
  const session = await auth()

  if (!session?.user) {
    return
  }

  const userId = session.user.id

  if (!userId) {
    return
  }

  try {
    const snapshot = await db
      .collection('groups')
      .where('userId', '==', userId)
      .get()

    const groups = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return groups as GroupByUserProps[]
  } catch (error) {
    console.error('Error fetching user groups:', error)
    return []
  }
}
