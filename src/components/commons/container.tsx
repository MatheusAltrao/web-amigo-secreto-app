import Header from './header'

interface ContainerProps {
  children: React.ReactNode
}

export default function Container({ children }: ContainerProps) {
  return (
    <div>
      <Header />

      <div className="w-full h-screen max-w-[1200px] flex justify-center mx-auto px-4 mt-10">
        <div>{children}</div>
      </div>
    </div>
  )
}
