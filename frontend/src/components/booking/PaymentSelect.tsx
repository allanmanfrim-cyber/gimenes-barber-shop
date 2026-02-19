import { useState } from 'react'
import { BookingData, PaymentMethod, PaymentType } from '../../types'
import { Button } from '../ui/Button'
import { Clock, Check, CreditCard, Banknote, Star, ShieldCheck, Wallet } from 'lucide-react'
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="bg-neutral-900/50 border border-white/[0.03] rounded-3xl p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5">
           <Star className="w-12 h-12 text-primary-500" />
        </div>
        
        <div className="flex flex-col items-center mb-6">
           <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em] mb-4">Resumo da Reserva</p>
           <div className="flex flex-col items-center gap-1">
              <h3 className="text-xl font-black text-white uppercase tracking-tight">{bookingData.service?.name}</h3>
              <p className="text-primary-500 font-bold text-xs uppercase tracking-widest">{bookingData.barber?.name || 'Próximo Barbeiro'}</p>
           </div>
        </div>

        <div className="flex items-center justify-between px-4 py-3 bg-black/40 rounded-2xl border border-white/[0.03] mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-primary-500" />
            <span className="text-xs font-bold text-neutral-300 uppercase tracking-tighter">{formattedDate}</span>
          </div>
          <span className="text-xs font-black text-white">{bookingData.time}</span>
        </div>

        <div className="text-center pt-4 border-t border-white/[0.03]">
          <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest mb-1">Valor do Investimento</p>
          <p className="text-4xl font-black text-white">
            <span className="text-sm font-bold text-primary-500 mr-1">R$</span>
            {bookingData.service?.price.toFixed(2).replace('.', ',')}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <Wallet className="w-3.5 h-3.5 text-primary-500" />
          <span className="text-[10px] text-primary-500 font-black uppercase tracking-[0.3em]">Escolha o Pagamento</span>
        </div>

        <div className="grid grid-cols-2 gap-3 p-1.5 bg-neutral-900 rounded-2xl border border-white/[0.03]">
          <button
            onClick={() => handleTypeChange('online')}
            className={`py-3.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
              paymentType === 'online'
                ? 'bg-primary-500 text-black shadow-[0_0_15px_rgba(197,160,89,0.2)]'
                : 'text-neutral-500 hover:text-white'
            }`}
          >
            Pagar Agora
          </button>
          <button
            onClick={() => handleTypeChange('presencial')}
            className={`py-3.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
              paymentType === 'presencial'
                ? 'bg-primary-500 text-black shadow-[0_0_15px_rgba(197,160,89,0.2)]'
                : 'text-neutral-500 hover:text-white'
            }`}
          >
            Pagar no Salão
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {paymentType === 'online' ? (
          <>
            <button
              onClick={() => handleMethodSelect('pix')}
              className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all border duration-300 group ${
                selectedMethod === 'pix'
                  ? 'bg-neutral-900 border-primary-500/50'
                  : 'bg-black border-white/[0.03] hover:border-white/10'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${selectedMethod === 'pix' ? 'bg-primary-500/20' : 'bg-neutral-900'}`}>
                  <svg viewBox="0 0 512 512" className={`w-6 h-6 transition-colors ${selectedMethod === 'pix' ? 'fill-primary-500' : 'fill-neutral-700'}`}>
                    <path d="M242.4 292.5C247.8 287.1 257.1 287.1 262.5 292.5L339.5 369.5C353.7 383.7 372.6 391.5 392.6 391.5H407.7L293.6 505.6C266.9 532.3 223.1 532.3 196.4 505.6L82.06 391.2H97.37C117.4 391.2 136.3 383.4 150.5 369.2L242.4 292.5zM262.5 219.5C257.1 224.9 247.8 224.9 242.4 219.5L150.5 142.8C136.3 128.6 117.4 120.8 97.37 120.8H82.06L196.4 6.431C223.1-20.27 266.9-20.27 293.6 6.431L407.7 120.5H392.6C372.6 120.5 353.7 128.3 339.5 142.5L262.5 219.5z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <p className={`font-black uppercase text-xs tracking-tight ${selectedMethod === 'pix' ? 'text-primary-500' : 'text-white'}`}>Pix Instantâneo</p>
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Confirmação Imediata</p>
                </div>
              </div>
              {selectedMethod === 'pix' && <Check className="w-5 h-5 text-primary-500" />}
            </button>

            <button
              onClick={() => handleMethodSelect('nubank')}
              className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all border duration-300 ${
                selectedMethod === 'nubank'
                  ? 'bg-neutral-900 border-primary-500/50'
                  : 'bg-black border-white/[0.03] hover:border-white/10'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg transition-colors ${selectedMethod === 'nubank' ? 'bg-[#820AD1]/20 text-[#820AD1]' : 'bg-neutral-900 text-neutral-700'}`}>
                  Nu
                </div>
                <div className="text-left">
                  <p className={`font-black uppercase text-xs tracking-tight ${selectedMethod === 'nubank' ? 'text-primary-500' : 'text-white'}`}>Nubank Pay</p>
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Pague pelo App Nu</p>
                </div>
              </div>
              {selectedMethod === 'nubank' && <Check className="w-5 h-5 text-primary-500" />}
            </button>

            <button
              onClick={() => handleMethodSelect('credit_card')}
              className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all border duration-300 ${
                selectedMethod === 'credit_card'
                  ? 'bg-neutral-900 border-primary-500/50'
                  : 'bg-black border-white/[0.03] hover:border-white/10'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${selectedMethod === 'credit_card' ? 'bg-primary-500/20' : 'bg-neutral-900'}`}>
                  <CreditCard className={`w-6 h-6 transition-colors ${selectedMethod === 'credit_card' ? 'text-primary-500' : 'text-neutral-700'}`} />
                </div>
                <div className="text-left">
                  <p className={`font-black uppercase text-xs tracking-tight ${selectedMethod === 'credit_card' ? 'text-primary-500' : 'text-white'}`}>Novo Cartão</p>
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Crédito ou Débito</p>
                </div>
              </div>
              {selectedMethod === 'credit_card' && <Check className="w-5 h-5 text-primary-500" />}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => handleMethodSelect('machine')}
              className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all border duration-300 ${
                selectedMethod === 'machine'
                  ? 'bg-neutral-900 border-primary-500/50'
                  : 'bg-black border-white/[0.03] hover:border-white/10'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${selectedMethod === 'machine' ? 'bg-primary-500/20' : 'bg-neutral-900'}`}>
                  <CreditCard className={`w-6 h-6 transition-colors ${selectedMethod === 'machine' ? 'text-primary-500' : 'text-neutral-700'}`} />
                </div>
                <div className="text-left">
                  <p className={`font-black uppercase text-xs tracking-tight ${selectedMethod === 'machine' ? 'text-primary-500' : 'text-white'}`}>Maquininha</p>
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Cartão no Salão</p>
                </div>
              </div>
              {selectedMethod === 'machine' && <Check className="w-5 h-5 text-primary-500" />}
            </button>

            <button
              onClick={() => handleMethodSelect('cash')}
              className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all border duration-300 ${
                selectedMethod === 'cash'
                  ? 'bg-neutral-900 border-primary-500/50'
                  : 'bg-black border-white/[0.03] hover:border-white/10'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${selectedMethod === 'cash' ? 'bg-primary-500/20' : 'bg-neutral-900'}`}>
                  <Banknote className={`w-6 h-6 transition-colors ${selectedMethod === 'cash' ? 'text-primary-500' : 'text-neutral-700'}`} />
                </div>
                <div className="text-left">
                  <p className={`font-black uppercase text-xs tracking-tight ${selectedMethod === 'cash' ? 'text-primary-500' : 'text-white'}`}>Dinheiro</p>
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Pagamento em Espécie</p>
                </div>
              </div>
              {selectedMethod === 'cash' && <Check className="w-5 h-5 text-primary-500" />}
            </button>
          </>
        )}
      </div>

      <div className="fixed bottom-6 left-6 right-6 max-w-lg mx-auto md:relative md:bottom-0 md:left-0 md:right-0 pt-4">
        <Button 
          fullWidth 
          onClick={onSubmit} 
          loading={loading}
          className="h-16 rounded-full bg-primary-500 text-black border-none font-black uppercase tracking-[0.2em] text-xs shadow-[0_10px_30px_rgba(197,160,89,0.3)] hover:scale-105 transition-all"
        >
          Finalizar Agendamento
        </Button>
      </div>

      <div className="flex items-center justify-center gap-2 pt-2">
         <ShieldCheck className="w-3.5 h-3.5 text-neutral-700" />
         <span className="text-[9px] font-black text-neutral-700 uppercase tracking-widest">Pagamento 100% Seguro</span>
      </div>
    </div>
  )
}






