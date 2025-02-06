'use server'

import { ParticipantsProps } from '@/app/new-group/components/form-create-group'
import { EmailTemplate } from '@/components/commons/email-template'
import { Resend } from 'resend'
import { GroupByUserProps } from '../group/get-group-by-user'
import { delayPromises } from '@/helpers/delay-promises'

export async function sendEmailsAction(group: GroupByUserProps) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const participants: ParticipantsProps[] = group?.participants || []

  const arrayWithSecretFriend = participants.map((participant, index, arr) => {
    if (participants.length < 2) {
      return {
        ...participant,
        secretFriend: participant.name,
      }
    }

    let secretFriend
    do {
      const remainingParticipants = arr.filter((_, i) => i !== index)
      secretFriend =
        remainingParticipants[
          Math.floor(Math.random() * remainingParticipants.length)
        ]
    } while (participant.name === secretFriend.name)
    return {
      ...participant,
      secretFriend: secretFriend.name,
    }
  })

  const results = []

  for (const participant of arrayWithSecretFriend) {
    const { data, error } = await resend.emails.send({
      from: 'Acme <noreplay@amigo-secreto.dev>',
      to: [participant.email],
      subject: group.name,
      react: await EmailTemplate({
        description: group.description,
        name: participant.name,
        secretFriend: participant.secretFriend,
        title: group.name,
      }),
    })

    if (error) {
      throw new Error(
        `Falha ao enviar e-mail para ${participant.email}: ${error.message}`,
      )
    }

    results.push(data)
    await delayPromises(600)
  }

  console.log(results)

  return results
}
