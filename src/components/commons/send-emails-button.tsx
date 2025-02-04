"use client";
import { sendEmailsAction } from "@/actions/email/send-emails";
import { Button } from "../ui/button";
import { Mail } from "lucide-react";
import { GroupByUserProps } from "@/actions/group/get-group-by-user";
import { useTransition } from "react";
import Loading from "./loading";
import toast from "react-hot-toast";

interface SendEmailsButtonProps {
  group: GroupByUserProps;
}

export default function SendEmailsButton({ group }: SendEmailsButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleSendEmail = () => {
    startTransition(async () => {
      try {
        await sendEmailsAction(group);
        toast.success("E-mails enviados com sucesso!");
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
