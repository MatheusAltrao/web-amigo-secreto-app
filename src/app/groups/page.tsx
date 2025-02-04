import { getGroupByUserAction } from "@/actions/group/get-group-by-user";
import GroupCard from "./components/group-card";
import Link from "next/link";
import Container from "@/components/commons/container";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function GroupsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const groups = await getGroupByUserAction();

  return (
    <Container>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {groups?.map((group) => <GroupCard key={group.id} group={group} />)}
      </div>
      {groups?.length === 0 && (
        <p className="text-center">
          Você não criou nenhum grupo ainda clique{" "}
          <Link className="text-primary underline" href={"/new-group"}>
            aqui
          </Link>{" "}
          para criar um.
        </p>
      )}
    </Container>
  );
}
