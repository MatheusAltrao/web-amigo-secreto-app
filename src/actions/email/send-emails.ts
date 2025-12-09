"use server";

import { ParticipantsProps } from "@/app/new-group/components/form-create-group";
import { Resend } from "resend";
import { GroupByUserProps } from "../group/get-group-by-user";

export async function sendEmailsAction(group: GroupByUserProps) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const participants: ParticipantsProps[] = group.participants;

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
    gift: participant.gift,
    secretFriend: secretFriend.name,
  }));

  console.log("Sorteio do amigo secreto:", results);
  return results;
}
