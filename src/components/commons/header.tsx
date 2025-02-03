import { Gift, Plus, Users } from 'lucide-react'
import { Button } from '../ui/button'
import Perfil from './perfil'
import Link from 'next/link'
import MobileMenu from './mobile-menu'

export default function Header() {
  return (
    <header className=" border-b">
      <div className="w-full max-w-[1200px] p-4 mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 ">
          <Gift className="text-primary" size={24} />
          <h1 className=" text-lg font-medium">Amigo Secreto</h1>
        </div>

        <div className=" hidden lg:flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Link href={'/groups'}>
              <Button variant={'outline'}>
                {' '}
                <Users size={20} /> Grupos{' '}
              </Button>
            </Link>
            <Link href="/new-group">
              <Button>
                {' '}
                <Plus size={20} />
                Novo Grupo{' '}
              </Button>
            </Link>
          </div>

          <div className="h-8 w-[2px] bg-muted" />
          <Perfil />
        </div>

        <MobileMenu />
      </div>
    </header>
  )
}
