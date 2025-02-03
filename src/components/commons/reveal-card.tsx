'use client'

import { TextRevealCard, TextRevealCardTitle } from '../ui/text-reveal-card'

interface RevealCardProps {
  secretFriend: string
}

export default function RevealCard({ secretFriend }: RevealCardProps) {
  return (
    <TextRevealCard text="Passe o mouse" revealText={secretFriend}>
      <TextRevealCardTitle className="text-2xl font-bold">
        Seu amigo secreto é ...
      </TextRevealCardTitle>
    </TextRevealCard>
  )
}
