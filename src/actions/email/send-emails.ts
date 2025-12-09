"use server";

import { ParticipantsProps } from "@/app/new-group/components/form-create-group";
import { EmailTemplate } from "@/components/commons/email-template";
import { delayPromises } from "@/helpers/delay-promises";
import { db } from "@/lib/firebase";
import { Resend } from "resend";
import { GroupByUserProps } from "../group/get-group-by-user";

export async function sendEmailsAction(group: GroupByUserProps) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const participants: ParticipantsProps[] = group.participants;

  if (!group.id) {
    throw new Error("ID do grupo não encontrado");
  }

  if (participants.length < 2) {
    throw new Error("É necessário pelo menos 2 participantes para o amigo secreto");
  }

  const availableSecretFriends = [...participants];
  const assignments: Array<{
    participant: ParticipantsProps;
    secretFriend: ParticipantsProps;
  }> = [];

  const shuffledParticipants = [...participants].sort(() => Math.random() - 0.5);

  for (let i = 0; i < shuffledParticipants.length; i++) {
    const participant = shuffledParticipants[i];

    let validOptions = availableSecretFriends.filter((sf) => sf.name !== participant.name);

    if (validOptions.length === 0) {
      const lastAssignment = assignments[assignments.length - 1];
      validOptions = [lastAssignment.secretFriend];

      lastAssignment.secretFriend = availableSecretFriends[0];
    }

    const randomIndex = Math.floor(Math.random() * validOptions.length);
    const secretFriend = validOptions[randomIndex];

    assignments.push({
      participant,
      secretFriend,
    });

    const indexToRemove = availableSecretFriends.findIndex((sf) => sf.name === secretFriend.name);
    availableSecretFriends.splice(indexToRemove, 1);
  }

  const results = assignments.map(({ participant, secretFriend }) => ({
    name: participant.name,
    email: participant.email,
    gift: participant.gift || "",
    secretFriend: secretFriend.name,
  }));

  console.log("Sorteio do amigo secreto:", results);

  const updatedParticipants = participants.map((participant) => {
    const assignment = results.find((r) => r.email === participant.email && r.name === participant.name);
    return {
      ...participant,
      secretFriend: assignment?.secretFriend || "",
    };
  });

  await db.collection("groups").doc(group.id).update({
    participants: updatedParticipants,
  });

  const emailResults = [];

  for (const assignment of results) {
    const { data, error } = await resend.emails.send({
      from: "Acme <noreplay@amigo-secreto.dev>",
      to: [assignment.email],
      subject: group.name,
      react: EmailTemplate({
        description: group.description,
        name: assignment.name,
        secretFriend: assignment.secretFriend,
        title: group.name,
        gift: assignment.gift || "",
      }),
    });

    if (error) {
      throw new Error(`Falha ao enviar e-mail para ${assignment.email}: ${error.message}`);
    }

    emailResults.push(data);
    await delayPromises(600);
  }

  return results;
}
