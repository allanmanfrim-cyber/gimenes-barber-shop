import { useState, ChangeEvent } from 'react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { Calendar as CalendarIcon, ArrowRight, User, Mail, MessageCircle, Star } from 'lucide-react'

interface ClientFormProps {
  initialName: string
  initialWhatsapp: string
  initialEmail: string
  initialBirthDate: string
  initialNotes: string
  onSubmit: (name: string, whatsapp: string, email: string, birthDate: string, notes: string) => void
}

export function ClientForm({
  initialName,
  initialWhatsapp,
  initialEmail,
  initialBirthDate,
  initialNotes,
  onSubmit
}: ClientFormProps) {
  const [name, setName] = useState(initialName)
  const [whatsapp, setWhatsapp] = useState(initialWhatsapp)
  const [email, setEmail] = useState(initialEmail)
  const [birthDate, setBirthDate] = useState(initialBirthDate)
  const [notes, setNotes] = useState(initialNotes)
  const [errors, setErrors] = useState<{ name?: string; whatsapp?: string; email?: string; birthDate?: string }>({})

  const formatWhatsapp = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 2) return numbers
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
  }

  const handleWhatsappChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatWhatsapp(e.target.value)
    setWhatsapp(formatted)
  }

  const validateEmail = (email: string) => {
    if (!email) return true
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validate = () => {
    const newErrors: { name?: string; whatsapp?: string; email?: string; birthDate?: string } = {}
    
    if (!name.trim()) {
      newErrors.name = 'O nome é obrigatório'
    }

    if (!birthDate) {
      newErrors.birthDate = 'A data de nascimento é obrigatória'
    }
    
    const whatsappNumbers = whatsapp.replace(/\D/g, '')
    if (!whatsappNumbers || whatsappNumbers.length < 10) {
      newErrors.whatsapp = 'WhatsApp inválido'
    }

    if (email && !validateEmail(email)) {
      newErrors.email = 'E-mail inválido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(name, whatsapp, email, birthDate, notes)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex items-center gap-2 mb-2 px-2">
        <Star className="w-3.5 h-3.5 text-primary-500 fill-primary-500" />
        <span className="text-[10px] text-primary-500 font-black uppercase tracking-[0.3em]">Dados Pessoais</span>
      </div>

      <div className="space-y-6">
        <div className="relative group">
          <Input
            label="Nome Completo"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            className="pl-14"
          />
          <User className="absolute left-5 top-11 w-5 h-5 text-neutral-600 group-focus-within:text-primary-500 transition-colors" />
        </div>

        <div className="relative group">
          <Input
            label="WhatsApp"
            placeholder="(00) 00000-0000"
            value={whatsapp}
            onChange={handleWhatsappChange}
            error={errors.whatsapp}
            className="pl-14"
          />
          <MessageCircle className="absolute left-5 top-11 w-5 h-5 text-neutral-600 group-focus-within:text-primary-500 transition-colors" />
        </div>

        <div className="relative group">
          <Input
            label="Data de Nascimento"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            error={errors.birthDate}
            className="pl-14 pr-4"
          />
          <CalendarIcon className="absolute left-5 top-11 w-5 h-5 text-neutral-600 group-focus-within:text-primary-500 transition-colors" />
        </div>

        <div className="relative group">
          <Input
            label="E-mail (opcional)"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            className="pl-14"
          />
          <Mail className="absolute left-5 top-11 w-5 h-5 text-neutral-600 group-focus-within:text-primary-500 transition-colors" />
        </div>

        <div className="group">
          <label className="block text-[10px] font-black text-primary-500/80 uppercase tracking-[0.2em] mb-2.5 ml-1 transition-colors group-focus-within:text-primary-500">
            Observações (opcional)
          </label>
          <textarea
            className="w-full bg-neutral-900 border border-white/[0.05] rounded-2xl px-5 py-4 text-white placeholder-neutral-600 focus:outline-none focus:border-primary-500/50 focus:bg-neutral-800/30 transition-all duration-300 font-medium resize-none shadow-[0_0_20px_rgba(197,160,89,0)] focus:shadow-[0_0_20px_rgba(197,160,89,0.05)]"
            placeholder="Algum detalhe para o barbeiro?"
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>

      <div className="fixed bottom-6 left-6 right-6 max-w-lg mx-auto md:relative md:bottom-0 md:left-0 md:right-0">
        <Button type="submit" fullWidth className="h-16 rounded-full bg-primary-500 text-black border-none font-black uppercase tracking-[0.2em] text-xs shadow-[0_10px_30px_rgba(197,160,89,0.3)] hover:scale-105 transition-all">
          Próximo Passo
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </form>
  )
}





