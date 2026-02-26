import { useEffect, useState, useRef } from 'react'
import { Copy, Check, Clock, ArrowLeft } from 'lucide-react'
import QRCode from 'qrcode'

interface PixPaymentProps {
  pixCode: string
  pixQrCodeBase64?: string
  amount: number
  appointmentId: number
  onConfirmed: () => void
  onCancel: () => void
  onBack: () => void
}

const TIMEOUT_MINUTES = 15

export function PixPayment({
  pixCode,
  pixQrCodeBase64,
  amount,
  appointmentId,
  onConfirmed,
  onCancel,
  onBack
}: PixPaymentProps) {
  const [copied, setCopied] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [timeLeft, setTimeLeft] = useState(TIMEOUT_MINUTES * 60)
  const [expired, setExpired] = useState(false)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const pollRef = useRef<NodeJS.Timeout | null>(null)

  // Gera QR Code
  useEffect(() => {
    if (pixQrCodeBase64) {
      setQrCodeUrl(`data:image/png;base64,${pixQrCodeBase64}`)
    } else if (pixCode) {
      QRCode.toDataURL(pixCode, {
        width: 250,
        margin: 2
      }).then(setQrCodeUrl)
    }
  }, [pixCode, pixQrCodeBase64])

  // Timer + Poll
  useEffect(() => {
    // Timer regressivo
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setExpired(true)
          if (timerRef.current) clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Poll backend
    pollRef.current = setInterval(async () => {
      try {
        const response = await fetch(`/api/appointments/${appointmentId}`)
        const data = await response.json()

        if (
          data.appointment?.status === 'pago' ||
          data.appointment?.status === 'confirmado'
        ) {
          if (pollRef.current) clearInterval(pollRef.current)
          if (timerRef.current) clearInterval(timerRef.current)
          onConfirmed()
        }
      } catch (error) {
        console.error('Erro ao verificar pagamento', error)
      }
    }, 5000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [appointmentId, onConfirmed])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(pixCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s
      .toString()
      .padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={onBack}
          className="text-dark-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-bold text-white">Pagamento via Pix</h2>
      </div>

      <div className="text-center">
        <h3 className="text-xl font-bold text-white mb-2">
          Aguardando seu pagamento
        </h3>
        <p className="text-dark-400 text-sm">
          O agendamento será confirmado automaticamente após a compensação.
        </p>
      </div>

      <div>
        <div
          onClick={handleCopy}
          className="flex items-center gap-3 bg-dark-800 border border-dark-600 rounded-xl p-4 cursor-pointer"
        >
          <p className="flex-1 text-dark-300 text-sm font-mono truncate">
            {pixCode}
          </p>
          {copied ? (
            <Check className="w-5 h-5 text-primary-500" />
          ) : (
            <Copy className="w-5 h-5 text-primary-500" />
          )}
        </div>
        {copied && (
          <p className="text-primary-500 text-xs mt-1 text-center">
            Copiado!
          </p>
        )}
      </div>

      {qrCodeUrl && (
        <div className="flex justify-center">
          <div className="bg-white rounded-xl p-3">
            <img
              src={qrCodeUrl}
              alt="QR Code Pix"
              className="w-52 h-52"
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-center gap-2 text-dark-300">
        <Clock className="w-4 h-4" />
        {expired ? (
          <span className="text-red-400">
            Tempo expirado
          </span>
        ) : (
          <span>
            Expira em{' '}
            <strong className="text-white">
              {formatTime(timeLeft)}
            </strong>
          </span>
        )}
      </div>

      <div className="pt-4 border-t border-dark-700">
        <button
          onClick={onCancel}
          className="w-full text-center text-dark-400 hover:text-red-400 text-sm underline"
        >
          Cancelar pagamento
        </button>
      </div>
    </div>
  )
}