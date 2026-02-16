import { useState } from 'react'
import { Calendar, User, Scissors, MapPin, Phone, ArrowRight } from 'lucide-react'
import { Service, Barber } from '../../types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface ClientFormProps {
  initialName: string
  initialWhatsapp: string
  initialNotes: string
  bookingData: {
    services: Service[]
    barber: Barber | null
    date: string
    time: string
  }
  onSubmit: (name: string, whatsapp: string, notes: string) => void
}

export function ClientForm({
  initialName,
  initialWhatsapp,
  initialNotes,
  bookingData,
  onSubmit
}: ClientFormProps) {
  const [name, setName] = useState(initialName)
  const [whatsapp, setWhatsapp] = useState(initialWhatsapp)
  const [errors, setErrors] = useState<{ name?: string; whatsapp?: string }>({})

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

  const validate = () => {
    const newErrors: { name?: string; whatsapp?: string } = {}
    
    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }
    
    const whatsappNumbers = whatsapp.replace(/\D/g, '')
    if (!whatsappNumbers || whatsappNumbers.length < 10) {
      newErrors.whatsapp = 'WhatsApp inválido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(name, whatsapp, initialNotes)
    }
  }

  const totalPrice = bookingData.services.reduce((acc, s) => acc + s.price, 0)
  const servicesNames = bookingData.services.map(s => s.name).join(', ')

  const formattedDateTime = bookingData.date && bookingData.time
    ? format(new Date(bookingData.date + 'T' + bookingData.time), "d 'de' MMMM 'às' HH:mm", { locale: ptBR })
    : ''

  return (
    <div className="px-4 py-6">
      <h2 className="text-2xl font-bold text-dark-900 mb-2">Confirme seu agendamento</h2>
      <p className="text-dark-400 mb-6">Revise os detalhes e preencha seus dados de contato</p>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h3 className="text-lg font-bold text-dark-900 mb-4">Resumo do agendamento</h3>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-dark-400 mt-0.5" />
            <div>
              <p className="text-sm text-dark-400">Data e horário</p>
              <p className="text-dark-900 font-medium">{formattedDateTime}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-dark-400 mt-0.5" />
            <div>
              <p className="text-sm text-dark-400">Barbeiro</p>
              <p className="text-dark-900 font-medium">{bookingData.barber?.name || 'Qualquer barbeiro'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Scissors className="w-5 h-5 text-dark-400 mt-0.5" />
            <div>
              <p className="text-sm text-dark-400">Serviços</p>
              <p className="text-dark-900 font-medium">{servicesNames || '-'}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="font-semibold text-dark-900">Total</span>
            <span className="font-bold text-dark-900">R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
          </div>

          <div className="flex items-start gap-3 pt-2 border-t border-gray-100">
            <MapPin className="w-5 h-5 text-dark-400 mt-0.5" />
            <div>
              <p className="text-sm text-dark-400">Endereço</p>
              <p className="text-dark-900">Rua dos Barbeiros, 123 - Centro, São Paulo - SP</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-dark-900 mb-2">
            Nome completo
          </label>
          <input
            type="text"
            placeholder="Digite seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full bg-white border rounded-xl px-4 py-3.5 text-dark-900 placeholder-dark-400 focus:outline-none focus:ring-2 transition-all ${
              errors.name 
                ? 'border-red-500 focus:ring-red-200' 
                : 'border-gray-200 focus:border-green-700 focus:ring-green-100'
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-dark-900 mb-2">
            WhatsApp
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
            <input
              type="tel"
              placeholder="(11) 98765-4321"
              value={whatsapp}
              onChange={handleWhatsappChange}
              className={`w-full bg-white border rounded-xl pl-12 pr-4 py-3.5 text-dark-900 placeholder-dark-400 focus:outline-none focus:ring-2 transition-all ${
                errors.whatsapp 
                  ? 'border-red-500 focus:ring-red-200' 
                  : 'border-gray-200 focus:border-green-700 focus:ring-green-100'
              }`}
            />
          </div>
          <p className="text-sm text-primary-600 mt-1">Enviaremos a confirmação via WhatsApp</p>
          {errors.whatsapp && (
            <p className="text-red-500 text-sm mt-1">{errors.whatsapp}</p>
          )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all bg-dark-900 text-white hover:bg-dark-800"
          >
            Continuar
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  )
}
