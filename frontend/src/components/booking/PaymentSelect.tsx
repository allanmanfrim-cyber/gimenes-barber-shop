import { useState } from 'react'
import { BookingData, PaymentMethod, PaymentType } from '../../types'
import { Button } from '../ui/Button'
import { Clock } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'

interface PaymentSelectProps {
  bookingData: BookingData
  loading: boolean
  onSelectPayment: (method: PaymentMethod, type: PaymentType) => void
  onSubmit: () => void
}

const ENABLE_CREDIT_CARD = false

export function PaymentSelect({
  bookingData,
  loading,
  onSelectPayment,
  onSubmit
}: PaymentSelectProps) {

  const [paymentType, setPaymentType] = useState<PaymentType>(
    bookingData.paymentType || 'online'
  )

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(
    bookingData.paymentMethod || 'pix'
  )

  const formattedDate = bookingData.date
    ? format(new Date(bookingData.date), "dd 'de' MMMM", { locale: ptBR })
    : ''

  const handleTypeChange = (type: PaymentType) => {
    setPaymentType(type)

    const defaultMethod: PaymentMethod =
      type === 'online' ? 'pix' : 'machine'

    setSelectedMethod(defaultMethod)
    onSelectPayment(defaultMethod, type)
  }

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method)
    onSelectPayment(method, paymentType)
  }

  return (
    <div className="space-y-8 pb-10">

      {/* RESUMO */}
      <div className="bg-neutral-900/50 border border-white/[0.03] rounded-3xl p-6">

        <div className="text-center mb-6">
          <p className="text-xs font-bold text-neutral-500 uppercase mb-2">
            Resumo da Reserva
          </p>
          <h3 className="text-lg font-bold text-white">
            {bookingData.service?.name}
          </h3>
          <p className="text-primary-500 text-sm">
            {bookingData.barber?.name || 'Próximo Barbeiro'}
          </p>
        </div>

        <div className="flex items-center justify-between px-4 py-3 bg-black/40 rounded-xl mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary-500" />
            <span className="text-sm text-neutral-300">
              {formattedDate}
            </span>
          </div>
          <span className="text-sm text-white">
            {bookingData.time}
          </span>
        </div>

        <div className="text-center">
          <p className="text-xs text-neutral-500 mb-1">
            Valor
          </p>
          <p className="text-3xl font-bold text-white">
            R$ {bookingData.service?.price.toFixed(2).replace('.', ',')}
          </p>
        </div>
      </div>

      {/* TIPO PAGAMENTO */}
      <div className="grid grid-cols-2 gap-3 bg-neutral-900 rounded-xl p-1">
        <button
          onClick={() => handleTypeChange('online')}
          className={`py-3 rounded-lg text-sm font-bold transition-all ${
            paymentType === 'online'
              ? 'bg-primary-500 text-black'
              : 'text-neutral-400'
          }`}
        >
          Pagar Agora
        </button>

        <button
          onClick={() => handleTypeChange('presencial')}
          className={`py-3 rounded-lg text-sm font-bold transition-all ${
            paymentType === 'presencial'
              ? 'bg-primary-500 text-black'
              : 'text-neutral-400'
          }`}
        >
          Pagar no Salão
        </button>
      </div>

      {/* MÉTODOS */}
      <div className="space-y-3">

        {paymentType === 'online' && (
          <>
            {/* PIX */}
            <button
              onClick={() => handleMethodSelect('pix')}
              className={`w-full p-4 border rounded-xl text-left transition-all ${
                selectedMethod === 'pix'
                  ? 'bg-primary-500 text-black border-primary-500'
                  : 'bg-black border-neutral-700 text-white'
              }`}
            >
              <div className="flex items-center gap-4">
                <img
                  src="/images/Pix.png"
                  alt="Pix"
                  className="w-8 h-8 object-contain"
                />
                <div>
                  <p className="font-bold">Pix</p>
                  <p className="text-xs opacity-70">
                    Confirmação imediata
                  </p>
                </div>
              </div>
            </button>

            {/* NUBANK */}
            <button
              onClick={() => handleMethodSelect('nubank')}
              className={`w-full p-4 border rounded-xl text-left transition-all ${
                selectedMethod === 'nubank'
                  ? 'bg-primary-500 text-black border-primary-500'
                  : 'bg-black border-neutral-700 text-white'
              }`}
            >
              <div className="flex items-center gap-4">
                <img
                  src="/images/Nubank.png"
                  alt="Nubank"
                  className="w-8 h-8 object-contain"
                />
                <div>
                  <p className="font-bold">Nubank</p>
                  <p className="text-xs opacity-70">
                    Pagamento pelo app
                  </p>
                </div>
              </div>
            </button>

            {ENABLE_CREDIT_CARD && (
              <button
                onClick={() => handleMethodSelect('credit_card')}
                className={`w-full p-4 border rounded-xl text-left transition-all ${
                  selectedMethod === 'credit_card'
                    ? 'bg-primary-500 text-black border-primary-500'
                    : 'bg-black border-neutral-700 text-white'
                }`}
              >
                Cartão de Crédito
              </button>
            )}
          </>
        )}

        {paymentType === 'presencial' && (
          <>
            <button
              onClick={() => handleMethodSelect('machine')}
              className={`w-full p-4 border rounded-xl text-left transition-all ${
                selectedMethod === 'machine'
                  ? 'bg-primary-500 text-black border-primary-500'
                  : 'bg-black border-neutral-700 text-white'
              }`}
            >
              Maquininha
            </button>

            <button
              onClick={() => handleMethodSelect('cash')}
              className={`w-full p-4 border rounded-xl text-left transition-all ${
                selectedMethod === 'cash'
                  ? 'bg-primary-500 text-black border-primary-500'
                  : 'bg-black border-neutral-700 text-white'
              }`}
            >
              Dinheiro
            </button>
          </>
        )}
      </div>

      <Button fullWidth onClick={onSubmit} loading={loading}>
        Finalizar Agendamento
      </Button>

      <div className="text-center text-xs text-neutral-600 pt-4">
        Pagamento 100% Seguro
      </div>
    </div>
  )
}