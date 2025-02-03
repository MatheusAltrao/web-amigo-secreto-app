'use client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CalendarIcon, Eye, TrashIcon } from 'lucide-react'
import { format } from 'date-fns'
import { GroupByUserProps } from '@/actions/group/get-group-by-user'
import toast from 'react-hot-toast'
import { useTransition } from 'react'
import Loading from '@/components/commons/loading'
import Link from 'next/link'
import { deleteGroupAction } from '@/actions/group/delete-group-action'

interface GroupCardProps {
  group: GroupByUserProps
}

export default function GroupCard({ group }: GroupCardProps) {
  const [isDeleting, startTransition] = useTransition()

  const handleDeleteGroup = async (id: string) => {
    startTransition(async () => {
      try {
        await deleteGroupAction(id)
        toast.success('Grupo apagado com sucesso!')
      } catch (error) {
        console.log(error)
        toast.error('Erro ao apagar grupo!')
      }
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{group.name}</CardTitle>
        <CardDescription className="line-clamp-2 h-10">
          {' '}
          {group.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {format(new Date(group.createdAt), 'dd/MM/yyyy')}
        </div>
      </CardContent>
      <CardFooter className="flex items-center gap-2">
        <Link className="w-full" href={`/groups/${group.id}`}>
          <Button className="w-full" variant="outline">
            <Eye /> Ver Detalhes
          </Button>
        </Link>
        <Button
          disabled={isDeleting}
          onClick={() => handleDeleteGroup(group.id)}
          className="w-full"
          variant="destructive"
        >
          {isDeleting ? (
            <Loading />
          ) : (
            <div className="flex items-center gap-2">
              {' '}
              <TrashIcon className="h-4 w-4" /> Apagar
            </div>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
