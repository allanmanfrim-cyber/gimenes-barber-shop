import { useState } from 'react'
import { CreditCard, QrCode, Check, Shield } from 'lucide-react'
import { Service, Barber } from '../../types'

interface PaymentSelectProps {
  bookingData: {
    services: Service[]
    barber: Barber | null
    date: string
    time: string
    clientName: string
  }
  loading: boolean
  onSubmit: (method: 'pix' | 'card') => void
}

export function PaymentSelect({
  bookingData,
  loading,
  onSubmit
}: PaymentSelectProps) {
  const [selectedMethod, setSelectedMethod] = useState<'pix' | 'card' | null>(null)

  const totalPrice = bookingData.services.reduce((acc, s) => acc + s.price, 0)

  const handleSubmit = () => {
    if (selectedMethod) {
      onSubmit(selectedMethod)
    }
  }

  return (
    <div className="px-4 py-6">
      <h2 className="text-2xl font-bold text-dark-900 mb-2">Escolha a forma de pagamento</h2>
      <p className="text-dark-400 mb-6">Selecione como deseja pagar pelo serviço</p>

      <div className="space-y-4 mb-6">
        <div
          onClick={() => setSelectedMethod('pix')}
          className={`bg-white rounded-xl p-5 cursor-pointer transition-all border-2 ${
            selectedMethod === 'pix'
              ? 'border-green-700 bg-green-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                selectedMethod === 'pix' ? 'bg-green-700' : 'bg-gray-100'
              }`}>
                <QrCode className={`w-6 h-6 ${selectedMethod === 'pix' ? 'text-white' : 'text-dark-600'}`} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-dark-900">Pix</h3>
                <p className="text-dark-500 text-sm">Pagamento instantâneo</p>
                <p className="text-green-600 text-sm font-medium mt-1">5% de desconto</p>
              </div>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
              selectedMethod === 'pix'
                ? 'border-green-700 bg-green-700'
                : 'border-gray-300'
            }`}>
              {selectedMethod === 'pix' && (
                <div className="w-2.5 h-2.5 bg-white rounded-full" />
              )}
            </div>
          </div>
          {selectedMethod === 'pix' && (
            <div className="mt-4 pt-4 border-t border-green-200">
              <div className="flex justify-between items-center">
                <span className="text-dark-600">Valor com desconto:</span>
                <span className="text-xl font-bold text-green-700">
                  R$ {(totalPrice * 0.95).toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
          )}
        </div>

        <div
          onClick={() => setSelectedMethod('card')}
          className={`bg-white rounded-xl p-5 cursor-pointer transition-all border-2 ${
            selectedMethod === 'card'
              ? 'border-green-700 bg-green-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                selectedMethod === 'card' ? 'bg-green-700' : 'bg-gray-100'
              }`}>
                <CreditCard className={`w-6 h-6 ${selectedMethod === 'card' ? 'text-white' : 'text-dark-600'}`} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-dark-900">Cartão de Crédito</h3>
                <p className="text-dark-500 text-sm">Parcele em até 3x sem juros</p>
              </div>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
              selectedMethod === 'card'
                ? 'border-green-700 bg-green-700'
                : 'border-gray-300'
            }`}>
              {selectedMethod === 'card' && (
                <div className="w-2.5 h-2.5 bg-white rounded-full" />
              )}
            </div>
          </div>
          {selectedMethod === 'card' && (
            <div className="mt-4 pt-4 border-t border-green-200">
              <div className="flex justify-between items-center">
                <span className="text-dark-600">Valor total:</span>
                <span className="text-xl font-bold text-dark-900">
                  R$ {totalPrice.toFixed(2).replace('.', ',')}
                </span>
              </div>
              <p className="text-sm text-dark-400 mt-1">
                ou 3x de R$ {(totalPrice / 3).toFixed(2).replace('.', ',')} sem juros
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-dark-600">Serviços selecionados</span>
          <span className="text-dark-900 font-medium">{bookingData.services.length}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-dark-900 font-semibold">Total a pagar</span>
          <span className="text-xl font-bold text-dark-900">
            {selectedMethod === 'pix' 
              ? `R$ ${(totalPrice * 0.95).toFixed(2).replace('.', ',')}`
              : `R$ ${totalPrice.toFixed(2).replace('.', ',')}`
            }
          </span>
        </div>
        {selectedMethod === 'pix' && (
          <p className="text-green-600 text-sm text-right mt-1">
            Economia de R$ {(totalPrice * 0.05).toFixed(2).replace('.', ',')}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 text-dark-400 text-sm mb-6 justify-center">
        <Shield className="w-4 h-4" />
        <span>Pagamento 100% seguro</span>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!selectedMethod || loading}
        className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
          selectedMethod && !loading
            ? 'bg-green-700 text-white hover:bg-green-800'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        {loading ? (
          'Processando...'
        ) : (
          <>
            <Check className="w-5 h-5" />
            Finalizar Agendamento
          </>
        )}
      </button>
    </div>
  )
}
