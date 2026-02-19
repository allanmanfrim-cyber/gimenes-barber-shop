import { useState } from 'react'
import { ArrowLeft, CreditCard, HelpCircle } from 'lucide-react'
import { Button } from '../ui/Button'

interface CardFormProps {
  amount: number
  loading: boolean
  onSubmit: (cardData: CardData) => void
  onBack: () => void
}

export interface CardData {
  number: string
  holderName: string
  expiry: string
  cvv: string
  cpf: string
}

export function CardForm({ amount: _amount, loading, onSubmit, onBack }: CardFormProps) {
  const [cardNumber, setCardNumber] = useState('')
  const [holderName, setHolderName] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [cpf, setCpf] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '').substring(0, 16)
    return numbers.replace(/(\d{4})(?=\d)/g, '$1 ')
  }

  const formatExpiry = (value: string) => {
    const numbers = value.replace(/\D/g, '').substring(0, 4)
    if (numbers.length > 2) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`
    }
    return numbers
  }

  const formatCpf = (value: string) => {
    const numbers = value.replace(/\D/g, '').substring(0, 11)
    if (numbers.length > 9) {
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9)}`
    } else if (numbers.length > 6) {
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`
    } else if (numbers.length > 3) {
      return `${numbers.slice(0, 3)}.${numbers.slice(3)}`
    }
    return numbers
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    const rawNumber = cardNumber.replace(/\s/g, '')

    if (rawNumber.length < 13) newErrors.number = 'Numero do cartao invalido'
    if (!holderName.trim()) newErrors.holderName = 'Nome e obrigatorio'
    if (expiry.length < 5) newErrors.expiry = 'Data invalida'
    if (cvv.length < 3) newErrors.cvv = 'CVV invalido'
    if (cpf.replace(/\D/g, '').length < 11) newErrors.cpf = 'CPF invalido'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit({
        number: cardNumber.replace(/\s/g, ''),
        holderName: holderName.toUpperCase(),
        expiry,
        cvv,
        cpf: cpf.replace(/\D/g, '')
      })
    }
  }

  const getCardBrand = () => {
    const num = cardNumber.replace(/\s/g, '')
    if (num.startsWith('4')) return 'Visa'
    if (/^5[1-5]/.test(num) || /^2[2-7]/.test(num)) return 'Mastercard'
    if (/^3[47]/.test(num)) return 'Amex'
    if (/^6(?:011|5)/.test(num)) return 'Discover'
    if (/^(636368|438935|504175|451416|636297)/.test(num)) return 'Elo'
    return ''
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-dark-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold text-white">Adicionar Cartao</h2>
        </div>
        <button className="text-dark-400 hover:text-white transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm text-dark-400 mb-2">Numero</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <CreditCard className="w-5 h-5 text-dark-500" />
            </div>
            <input
              type="text"
              inputMode="numeric"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="1234 5678 9012 3456"
              className="w-full bg-dark-800 border-b-2 border-dark-600 focus:border-primary-500 pl-12 pr-4 py-3 text-white text-lg placeholder-dark-500 focus:outline-none transition-colors"
            />
            {getCardBrand() && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-500 text-xs font-medium">
                {getCardBrand()}
              </span>
            )}
          </div>
          {errors.number && <p className="text-red-400 text-xs mt-1">{errors.number}</p>}
        </div>

        <div>
          <label className="block text-sm text-dark-400 mb-2">Nome do titular do cartao</label>
          <input
            type="text"
            value={holderName}
            onChange={(e) => setHolderName(e.target.value)}
            placeholder="JOAO DA SILVA"
            className="w-full bg-dark-800 border-b-2 border-dark-600 focus:border-primary-500 px-4 py-3 text-white text-lg placeholder-dark-500 focus:outline-none transition-colors uppercase"
          />
          {errors.holderName && <p className="text-red-400 text-xs mt-1">{errors.holderName}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-dark-400 mb-2">Validade</label>
            <input
              type="text"
              inputMode="numeric"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              placeholder="MM/YY"
              className="w-full bg-dark-800 border-b-2 border-dark-600 focus:border-primary-500 px-4 py-3 text-white text-lg placeholder-dark-500 focus:outline-none transition-colors"
            />
            {errors.expiry && <p className="text-red-400 text-xs mt-1">{errors.expiry}</p>}
          </div>
          <div>
            <label className="block text-sm text-dark-400 mb-2">CVV</label>
            <input
              type="text"
              inputMode="numeric"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
              placeholder="123"
              className="w-full bg-dark-800 border-b-2 border-dark-600 focus:border-primary-500 px-4 py-3 text-white text-lg placeholder-dark-500 focus:outline-none transition-colors"
            />
            {errors.cvv && <p className="text-red-400 text-xs mt-1">{errors.cvv}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm text-dark-400 mb-2">CPF do titular do cartao</label>
          <input
            type="text"
            inputMode="numeric"
            value={cpf}
            onChange={(e) => setCpf(formatCpf(e.target.value))}
            placeholder="123.456.789-00"
            className="w-full bg-dark-800 border-b-2 border-dark-600 focus:border-primary-500 px-4 py-3 text-white text-lg placeholder-dark-500 focus:outline-none transition-colors"
          />
          {errors.cpf && <p className="text-red-400 text-xs mt-1">{errors.cpf}</p>}
        </div>

        <Button type="submit" fullWidth loading={loading}>
          ADICIONAR CARTAO
        </Button>

        <p className="text-dark-600 text-[10px] text-center">
          Seus dados de cartao sao tokenizados e nunca armazenados em nossos servidores.
        </p>
      </form>
    </div>
  )
}



