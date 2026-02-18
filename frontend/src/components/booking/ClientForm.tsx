import { useState } from 'react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

interface ClientFormProps {
  initialName: string
  initialWhatsapp: string
  initialEmail: string
  initialNotes: string
  onSubmit: (name: string, whatsapp: string, email: string, notes: string) => void
}

export function ClientForm({
  initialName,
  initialWhatsapp,
  initialEmail,
  initialNotes,
  onSubmit
}: ClientFormProps) {
  const [name, setName] = useState(initialName)
  const [whatsapp, setWhatsapp] = useState(initialWhatsapp)
  const [email, setEmail] = useState(initialEmail)
  const [notes, setNotes] = useState(initialNotes)
  const [errors, setErrors] = useState<{ name?: string; whatsapp?: string; email?: string }>({})

  const formatWhatsapp = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 2) return numbers
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
  }

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatWhatsapp(e.target.value)
    setWhatsapp(formatted)
  }

  const validateEmail = (email: string) => {
    if (!email) return true
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validate = () => {
    const newErrors: { name?: string; whatsapp?: string; email?: string } = {}
    
    if (!name.trim()) {
      newErrors.name = 'Nome e obrigatorio'
    }
    
    const whatsappNumbers = whatsapp.replace(/\D/g, '')
    if (!whatsappNumbers || whatsappNumbers.length < 10) {
      newErrors.whatsapp = 'WhatsApp invalido'
    }

    if (email && !validateEmail(email)) {
      newErrors.email = 'E-mail invalido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(name, whatsapp, email, notes)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Seu nome"
        placeholder="Digite seu nome completo"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
      />

      <Input
        label="WhatsApp"
        placeholder="(00) 00000-0000"
        value={whatsapp}
        onChange={handleWhatsappChange}
        error={errors.whatsapp}
      />

      <Input
        label="E-mail (opcional)"
        type="email"
        placeholder="seu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />

      <div>
        <label className="block text-sm font-medium text-dark-200 mb-2">
          Observacoes (opcional)
        </label>
        <textarea
          className="w-full bg-dark-800 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all resize-none"
          placeholder="Alguma observacao especial?"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <Button type="submit" fullWidth>
        Continuar
      </Button>
    </form>
  )
}
