'use server'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { getReadParticipantsAction } from '@/actions/group/get-read-participants'
import { ParticipantsProps } from '@/app/new-group/components/form-create-group'
import { format } from 'date-fns'
import { redirect } from 'next/navigation'
import SendEmailsButton from '@/components/commons/send-emails-button'
import RevealCard from '@/components/commons/reveal-card'
import { findMySecretFriend } from '@/actions/group/finde-my-secred-friend'
import Container from '@/components/commons/container'
import { auth } from '@/lib/auth'

interface GroupByIdPageProps {
  params: Promise<{ id: string }>
}

export default async function GroupByIdPage({ params }: GroupByIdPageProps) {
  const session = await auth()

  if (!session?.user) {
    redirect('/')
  }

  const id = (await params).id
  const group = await getReadParticipantsAction(id)

  if (!group) {
    redirect('/groups')
  }

  const participants: ParticipantsProps[] = group?.participants || []

  const secretFriend = await findMySecretFriend({ id })

  return (
    <Container>
      <div className="flex justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>{group?.name}</CardTitle>
            <CardDescription className="space-y-3">
              <div>{group?.description}</div>

              <div>
                <span className="text-xs">
                  Criado em: {format(new Date(group?.createdAt), 'dd/MM/yyyy')}
                </span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h2>Participantes</h2>
                <SendEmailsButton group={group} />
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {participants.map((participant, index) => (
                    <TableRow key={index}>
                      <TableCell>{participant.name}</TableCell>
                      <TableCell>{participant.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <RevealCard secretFriend={secretFriend} />
          </CardContent>
        </Card>
      </div>
    </Container>
  )
}
