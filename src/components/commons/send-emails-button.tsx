"use client";
import { sendEmailsAction } from "@/actions/email/send-emails";
import { GroupByUserProps } from "@/actions/group/get-group-by-user";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import Loading from "./loading";

interface SendEmailsButtonProps {
  group: GroupByUserProps;
}

export default function SendEmailsButton({ group }: SendEmailsButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSendEmail = () => {
    startTransition(async () => {
      try {
        await sendEmailsAction(group);
        toast.success("E-mails enviados com sucesso!");
        router.refresh();
      } catch (error) {
        console.log(error);
        toast.error("Erro ao enviar e-mails");
      }
    });
  };

  return (
    <Button disabled={isPending} onClick={handleSendEmail}>
      {isPending ? (
        <Loading />
      ) : (
        <div className=" flex items-center gap-2">
          <Mail /> Enviar E-mails
        </div>
      )}
    </Button>
  );
}
