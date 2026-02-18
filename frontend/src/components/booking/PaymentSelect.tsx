import { useState } from 'react'
import { BookingData, PaymentMethod, PaymentType } from '../../types'
import { Button } from '../ui/Button'
import { Clock, User, Scissors, Check, CreditCard, Banknote } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface PaymentSelectProps {
  bookingData: BookingData
  loading: boolean
  onSelectPayment: (method: PaymentMethod, type: PaymentType) => void
  onSubmit: () => void
}

export function PaymentSelect({
  bookingData,
  loading,
  onSelectPayment,
  onSubmit
}: PaymentSelectProps) {
  const [paymentType, setPaymentType] = useState<PaymentType>(bookingData.paymentType || 'online')
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(bookingData.paymentMethod || 'pix')

  const formattedDate = bookingData.date
    ? format(parseISO(bookingData.date), "dd 'de' MMMM", { locale: ptBR })
    : ''

  const handleTypeChange = (type: PaymentType) => {
    setPaymentType(type)
    const defaultMethod: PaymentMethod = type === 'online' ? 'pix' : 'machine'
    setSelectedMethod(defaultMethod)
    onSelectPayment(defaultMethod, type)
  }

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method)
    onSelectPayment(method, paymentType)
  }

  return (
    <div className="space-y-6">
      <div className="bg-dark-800 border border-dark-700 rounded-xl p-5">
        <p className="text-dark-400 text-sm text-center mb-1">seu agendamento</p>
        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-dark-300 text-sm">
            <Scissors className="w-4 h-4 text-primary-500" />
            <span>{bookingData.service?.name}</span>
          </div>
          <div className="flex items-center gap-2 text-dark-300 text-sm">
            <User className="w-4 h-4 text-primary-500" />
            <span>{bookingData.barber?.name || 'Qualquer barbeiro'}</span>
          </div>
          <div className="flex items-center gap-2 text-dark-300 text-sm">
            <Clock className="w-4 h-4 text-primary-500" />
            <span>{formattedDate} as {bookingData.time}</span>
          </div>
        </div>

        <div className="text-center pt-3 border-t border-dark-700">
          <p className="text-dark-500 text-xs">total</p>
          <p className="text-3xl font-bold text-white">
            R$ {bookingData.service?.price.toFixed(2)}
          </p>
        </div>
      </div>

      <div>
        <p className="text-white font-medium mb-3">como vai ser o pagamento?</p>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleTypeChange('online')}
            className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
              paymentType === 'online'
                ? 'bg-primary-500 text-dark-900'
                : 'bg-dark-800 border border-dark-600 text-dark-300 hover:border-dark-500'
            }`}
          >
            pelo aplicativo
          </button>
          <button
            onClick={() => handleTypeChange('presencial')}
            className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
              paymentType === 'presencial'
                ? 'bg-primary-500 text-dark-900'
                : 'bg-dark-800 border border-dark-600 text-dark-300 hover:border-dark-500'
            }`}
          >
            no salao
          </button>
        </div>
      </div>

      {paymentType === 'online' && (
        <div className="space-y-1">
          <button
            onClick={() => handleMethodSelect('pix')}
            className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all border ${
              selectedMethod === 'pix'
                ? 'bg-dark-700 border-primary-500'
                : 'bg-dark-800 border-dark-700 hover:border-dark-500'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-[#32BCAD]/20 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 512 512" className="w-6 h-6" fill="#32BCAD">
                <path d="M242.4 292.5C247.8 287.1 257.1 287.1 262.5 292.5L339.5 369.5C353.7 383.7 372.6 391.5 392.6 391.5H407.7L293.6 505.6C266.9 532.3 223.1 532.3 196.4 505.6L82.06 391.2H97.37C117.4 391.2 136.3 383.4 150.5 369.2L242.4 292.5zM262.5 219.5C257.1 224.9 247.8 224.9 242.4 219.5L150.5 142.8C136.3 128.6 117.4 120.8 97.37 120.8H82.06L196.4 6.431C223.1-20.27 266.9-20.27 293.6 6.431L407.7 120.5H392.6C372.6 120.5 353.7 128.3 339.5 142.5L262.5 219.5z"/>
              </svg>
            </div>
            <div className="flex-1 text-left">
              <p className="text-white font-medium">Pix</p>
              <p className="text-dark-500 text-xs">Pagamento instantaneo</p>
            </div>
            {selectedMethod === 'pix' && (
              <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-dark-900" />
              </div>
            )}
          </button>

          <button
            onClick={() => handleMethodSelect('nubank')}
            className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all border ${
              selectedMethod === 'nubank'
                ? 'bg-dark-700 border-primary-500'
                : 'bg-dark-800 border-dark-700 hover:border-dark-500'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-[#820AD1]/20 flex items-center justify-center flex-shrink-0">
              <span className="text-[#820AD1] font-black text-lg">Nu</span>
            </div>
            <div className="flex-1 text-left">
              <p className="text-white font-medium">Nubank</p>
              <p className="text-dark-500 text-xs">Pagar pelo app Nubank</p>
            </div>
            {selectedMethod === 'nubank' && (
              <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-dark-900" />
              </div>
            )}
          </button>

          <button
            onClick={() => handleMethodSelect('card')}
            className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all border ${
              selectedMethod === 'card'
                ? 'bg-dark-700 border-primary-500'
                : 'bg-dark-800 border-dark-700 hover:border-dark-500'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-dark-600 flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-6 h-6 text-primary-500" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-white font-medium">+ adicionar cartao</p>
              <p className="text-dark-500 text-xs">Credito ou debito</p>
            </div>
            {selectedMethod === 'card' && (
              <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-dark-900" />
              </div>
            )}
          </button>
        </div>
      )}

      {paymentType === 'presencial' && (
        <div className="space-y-1">
          <button
            onClick={() => handleMethodSelect('machine')}
            className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all border ${
              selectedMethod === 'machine'
                ? 'bg-dark-700 border-primary-500'
                : 'bg-dark-800 border-dark-700 hover:border-dark-500'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-dark-600 flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-6 h-6 text-primary-500" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-white font-medium">Maquina de cartao</p>
              <p className="text-dark-500 text-xs">Credito ou debito no salao</p>
            </div>
            {selectedMethod === 'machine' && (
              <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-dark-900" />
              </div>
            )}
          </button>

          <button
            onClick={() => handleMethodSelect('cash')}
            className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all border ${
              selectedMethod === 'cash'
                ? 'bg-dark-700 border-primary-500'
                : 'bg-dark-800 border-dark-700 hover:border-dark-500'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-dark-600 flex items-center justify-center flex-shrink-0">
              <Banknote className="w-6 h-6 text-green-500" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-white font-medium">Dinheiro</p>
              <p className="text-dark-500 text-xs">Pagar em especie no salao</p>
            </div>
            {selectedMethod === 'cash' && (
              <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-dark-900" />
              </div>
            )}
          </button>
        </div>
      )}

      <Button fullWidth onClick={onSubmit} loading={loading}>
        CONFIRMAR PAGAMENTO
      </Button>
    </div>
  )
}
