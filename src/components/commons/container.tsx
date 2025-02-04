import Header from "./header";

interface ContainerProps {
  children: React.ReactNode;
}

export default function Container({ children }: ContainerProps) {
  return (
    <div>
      <Header />

      <div className="w-full min-h-screen max-w-[1200px]  mx-auto px-4 mt-10">
        <div>{children}</div>
      </div>
    </div>
  );
}
