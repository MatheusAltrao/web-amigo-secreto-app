"use server";

import { ParticipantsProps } from "@/app/new-group/components/form-create-group";
import { EmailTemplate } from "@/components/commons/email-template";
import { Resend } from "resend";
import { GroupByUserProps } from "../group/get-group-by-user";

export async function sendEmailsAction(group: GroupByUserProps) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const participants: ParticipantsProps[] = group?.participants || [];

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

  const emailPromises = arrayWithSecretFriend.map(async (participant) => {
    const { data, error } = await resend.emails.send({
      from: "Acme <noreplay@amigo-secreto.dev>",
      to: [participant.email],
      subject: group.name,
      react: await EmailTemplate({
        description: group.description,
        name: participant.name,
        secretFriend: participant.secretFriend,
        title: group.name,
      }),
    });

    if (error) {
      throw new Error(
        `Failed to send email to ${participant.email}: ${error.message}`
      );
    }

    return data;
  });

  const results = await Promise.all(emailPromises);

  return results;
}
