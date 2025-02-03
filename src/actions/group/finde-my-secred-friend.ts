'use server'

import { ParticipantsProps } from '@/app/new-group/components/form-create-group'
import { auth } from '@/lib/auth'
import { db } from '@/lib/firebase'

interface FindMySecretFriendProps {
  id: string
}

export async function findMySecretFriend({ id }: FindMySecretFriendProps) {
  const session = await auth()

  if (!session) {
    return
  }

  const email = session.user?.email

  try {
    const groupDoc = await db.collection('groups').doc(id).get()

    const secretFriend = groupDoc
      .data()
      ?.participants.find(
        (participant: ParticipantsProps) => participant.email === email,
      )?.secretFriend

    return secretFriend
  } catch (error) {
    console.log(error)
    return null
  }
}
