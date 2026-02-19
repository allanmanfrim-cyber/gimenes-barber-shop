import { useEffect, useState, useRef } from 'react'
import { Clock, ArrowLeft } from 'lucide-react'
import { Button } from '../ui/Button'

interface NubankPaymentProps {
  pixCode: string
  amount: number
  appointmentId: number
  onConfirmed: () => void
  onCancel: () => void
  onBack: () => void
}

const TIMEOUT_MINUTES = 15

export function NubankPayment({
  pixCode,
  amount,
  appointmentId,
  onConfirmed,
  onCancel,
  onBack
}: NubankPaymentProps) {
  const [timeLeft, setTimeLeft] = useState(TIMEOUT_MINUTES * 60)
  const [expired, setExpired] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setExpired(true)
          if (intervalRef.current) clearInterval(intervalRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    pollRef.current = setInterval(async () => {
      try {
        const response = await fetch(`/api/appointments/${appointmentId}`)
        const data = await response.json()
        if (data.appointment?.payment?.status?.startsWith('paid')) {
          onConfirmed()
        }
      } catch {}
    }, 5000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [appointmentId, onConfirmed])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleOpenNubank = () => {
    const nubankDeepLink = `nubank://payment/pix?code=${encodeURIComponent(pixCode)}`
    const nubankFallback = 'https://nubank.com.br/pagar'

    const timeout = setTimeout(() => {
      window.location.href = nubankFallback
    }, 2000)

    window.location.href = nubankDeepLink
    
    window.addEventListener('blur', () => {
      clearTimeout(timeout)
    }, { once: true })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={onBack} className="text-dark-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-bold text-white">Pagamento</h2>
      </div>

      <div className="text-center space-y-4 py-6">
        <div className="w-24 h-24 mx-auto bg-[#820AD1]/20 rounded-full flex items-center justify-center">
          <span className="text-[#820AD1] font-black text-3xl">Nu</span>
        </div>

        <div>
          <h3 className="text-xl font-bold text-white mb-2">
            aguardando seu pagamento com Nubank
          </h3>
          <p className="text-dark-400">
            voce ainda precisa <strong className="text-white">confirmar o pagamento</strong> pelo app do Nubank.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-dark-300">
          <Clock className="w-4 h-4" />
          {expired ? (
            <span className="text-red-400">Tempo expirado</span>
          ) : (
            <span>
              voce tem ate <strong className="text-white">{formatTime(timeLeft)}</strong> para pagar
            </span>
          )}
        </div>

        <div className="bg-dark-800 border border-dark-700 rounded-xl p-4">
          <p className="text-dark-500 text-xs mb-1">valor</p>
          <p className="text-2xl font-bold text-white">R$ {amount.toFixed(2)}</p>
        </div>
      </div>

      <Button
        fullWidth
        onClick={handleOpenNubank}
        disabled={expired}
        className="!bg-[#820AD1] hover:!bg-[#6B08AE] !text-white"
      >
        ABRIR NUBANK
      </Button>

      <div className="pt-2">
        <button
          onClick={onCancel}
          className="w-full text-center text-dark-400 hover:text-red-400 text-sm underline transition-colors"
        >
          cancelar esse pagamento e voltar
        </button>
      </div>
    </div>
  )
}



