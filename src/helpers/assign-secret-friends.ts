import { ParticipantsProps } from "@/app/new-group/components/form-create-group";
import { shuffleArray } from "./shuffle-list";

export function assignSecretFriends(participants: ParticipantsProps[]) {
  let shuffledParticipants: ParticipantsProps[] = [];

  do {
    shuffledParticipants = shuffleArray(participants);
  } while (
    participants.some(
      (participant, index) =>
        participant.name === shuffledParticipants[index].name
    )
  );

  return participants.map((participant, index) => ({
    ...participant,
    secretFriend: shuffledParticipants[index].name,
  }));
}
