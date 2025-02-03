import * as React from 'react'

interface EmailTemplateProps {
  name: string
  title: string
  description: string
  secretFriend: string
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  name,
  title,
  description,
  secretFriend,
}) => (
  <div className="space-y-4">
    <h3>Olá, {name}!</h3>
    <div>
      <span>{title}</span>
      <br />
      <span>{description}</span>
    </div>

    <div>
      <p>
        🎉 Seu Amigo Secreto é: <strong>{secretFriend}</strong>! 🎉
      </p>
    </div>

    <div>
      <p>
        Desenvolvido por{' '}
        <a target="_blank" href="https://matheusaltrao.dev/">
          Matheus Altrão
        </a>
      </p>
    </div>
  </div>
)
