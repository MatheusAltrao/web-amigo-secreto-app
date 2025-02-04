import { ParticipantsProps } from "@/app/new-group/components/form-create-group";

export function shuffleArray(array: ParticipantsProps[]) {
  return array
    .map((participant) => ({ participant, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ participant }) => participant);
}
