import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Menu, Plus, Users } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'
import Perfil from './perfil'

export default function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button size={'icon'} variant="outline">
          <Menu size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>
            Esse é o nosso menu de navegação. Aqui você pode acessar todas as
            páginas do nosso site.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8 space-y-4">
          <h2 className="font-medium text-lg">Rotas</h2>

          <div className="flex flex-col gap-2">
            <Link href="/new-group">
              <Button className="w-full">
                {' '}
                <Plus size={20} />
                Novo Grupo{' '}
              </Button>
            </Link>

            <Link href={'/groups'}>
              <Button className="w-full" variant={'outline'}>
                {' '}
                <Users size={20} /> Grupos{' '}
              </Button>
            </Link>

            <Perfil />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
