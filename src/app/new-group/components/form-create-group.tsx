"use client";
import { createGroupAction } from "@/actions/group/create-group-action";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export interface ParticipantsProps {
  name: string;
  email: string;
}

interface FormCreateGroupProps {
  userName: string;
  userEmail: string;
}

export default function FormCreateGroup({
  userName,
  userEmail,
}: FormCreateGroupProps) {
  const [participants, setParticipants] = useState<ParticipantsProps[]>([
    { name: userName, email: userEmail },
    { name: "", email: "" },
  ]);
  const [groupName, setGroupName] = useState<string>("");
  const [groupDescription, setGroupDescription] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [participants]);

  const handleAddParticipant = () => {
    setParticipants([...participants, { name: "", email: "" }]);
  };

  const handleRemoveParticipant = (index: number) => {
    if (index === 0) return;
    const newParticipants = participants.filter((_, i) => i !== index);
    setParticipants(newParticipants);
  };
  const handleUpdateParticipant = (
    index: number,
    field: "name" | "email",
    value: string
  ) => {
    if (index === 0) return;
    const updatedParticipants = participants.map((participant, i) =>
      i === index ? { ...participant, [field]: value } : participant
    );
    setParticipants(updatedParticipants);
  };

  const arrayWithSecretFriend = participants.map((participant, index, arr) => {
    if (participants.length < 2) {
      return {
        ...participant,
        secretFriend: participant.name,
      };
    }

    let secretFriend;
    do {
      const remainingParticipants = arr.filter((_, i) => i !== index);
      secretFriend =
        remainingParticipants[
          Math.floor(Math.random() * remainingParticipants.length)
        ];
    } while (participant.name === secretFriend.name);
    return {
      ...participant,
      secretFriend: secretFriend.name,
    };
  });

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const group = await createGroupAction({
        groupDescription,
        groupName,
        participants: arrayWithSecretFriend,
      });

      toast.success("Grupo criado com sucesso");
      setGroupName("");
      setGroupDescription("");
      setParticipants([
        { name: userName, email: userEmail },
        { name: "", email: "" },
      ]);
      router.push(`/groups/${group}`);
    } catch (error) {
      console.log(error);
      toast.error("Falha ao criar grupo");
      return false;
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Novo Grupo</CardTitle>
        <CardDescription>Convide os seus amigos par participar</CardDescription>
      </CardHeader>

      <form onSubmit={(e) => handleCreateGroup(e)}>
        <CardContent>
          <div className=" space-y-8">
            <div className="space-y-4">
              <h2 className="font-bold">Grupo</h2>

              <div className="space-y-2">
                <div>
                  <Label>Nome do grupo</Label>
                  <Input
                    onChange={(e) => setGroupName(e.target.value)}
                    value={groupName}
                    required
                    type="text"
                    placeholder="Amigos da firma"
                  />
                </div>

                <div>
                  <Label>Descrição do grupo</Label>
                  <Input
                    onChange={(e) => setGroupDescription(e.target.value)}
                    value={groupDescription}
                    required
                    type="text"
                    placeholder="Valor máximo de R$ 50,00"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 w-full">
              <div className="space-y-1.5">
                <h2 className="font-bold">Participantes</h2>
                <p className="text-muted-foreground text-sm">
                  Adicione o nome e o email dos participantes, lembre-se esse
                  e-mail será usado para enviarmos o amigo que o usuário tirou
                </p>
              </div>

              <ScrollArea className="h-[300px] overflow-auto w-full">
                <div className="pr-4 flex flex-col gap-2 w-full">
                  {participants.map((participant, index) => (
                    <div key={index} className="flex items-end gap-2">
                      <div>
                        <Label htmlFor={`name-${index}`}>Nome</Label>
                        <Input
                          value={participant.name}
                          onChange={(e) =>
                            handleUpdateParticipant(
                              index,
                              "name",
                              e.target.value
                            )
                          }
                          type="text"
                          required
                          id={`name-${index}`}
                          placeholder="Nome da pessoa"
                          readOnly={index === 0} // Bloqueia edição do usuário fixo
                        />
                      </div>
                      <div>
                        <Label htmlFor={`email-${index}`}>Email</Label>
                        <Input
                          value={participant.email}
                          onChange={(e) =>
                            handleUpdateParticipant(
                              index,
                              "email",
                              e.target.value
                            )
                          }
                          type="email"
                          required
                          id={`email-${index}`}
                          placeholder="email da pessoa"
                          readOnly={index === 0}
                        />
                      </div>
                      <div>
                        {index > 0 && (
                          <Button
                            type="button"
                            onClick={() => handleRemoveParticipant(index)}
                            size={"icon"}
                            variant={"secondary"}
                          >
                            <Trash2 />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div ref={scrollRef}></div>
              </ScrollArea>
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t flex items-center justify-between gap-2 p-4">
          <Button
            type="button"
            onClick={handleAddParticipant}
            variant={"outline"}
          >
            <Plus size={20} /> Adicionar Amigo
          </Button>
          <Button type="submit">
            <Users size={20} /> Criar grupo
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
