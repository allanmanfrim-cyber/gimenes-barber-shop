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
  amount: _amount,
  appointmentId,
  onConfirmed,
  onCancel,
  onBack
}: PixPaymentProps) {
  const [copied, setCopied] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [timeLeft, setTimeLeft] = useState(TIMEOUT_MINUTES * 60)
  const [expired, setExpired] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (pixQrCodeBase64) {
      setQrCodeUrl(`data:image/png;base64,${pixQrCodeBase64}`)
    } else if (pixCode) {
      QRCode.toDataURL(pixCode, {
        width: 250,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' }
      }).then(setQrCodeUrl)
    }
  }, [pixCode, pixQrCodeBase64])

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

  const handleCopy = async () => {
    await navigator.clipboard.writeText(pixCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={onBack} className="text-dark-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-bold text-white">Pagamento</h2>
      </div>

      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-4 bg-[#32BCAD]/20 rounded-full flex items-center justify-center">
          <svg viewBox="0 0 512 512" className="w-10 h-10" fill="#32BCAD">
            <path d="M242.4 292.5C247.8 287.1 257.1 287.1 262.5 292.5L339.5 369.5C353.7 383.7 372.6 391.5 392.6 391.5H407.7L293.6 505.6C266.9 532.3 223.1 532.3 196.4 505.6L82.06 391.2H97.37C117.4 391.2 136.3 383.4 150.5 369.2L242.4 292.5zM262.5 219.5C257.1 224.9 247.8 224.9 242.4 219.5L150.5 142.8C136.3 128.6 117.4 120.8 97.37 120.8H82.06L196.4 6.431C223.1-20.27 266.9-20.27 293.6 6.431L407.7 120.5H392.6C372.6 120.5 353.7 128.3 339.5 142.5L262.5 219.5z"/>
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">
          aguardando seu pagamento com Pix
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-primary-500 font-semibold mb-2">
            <span className="text-primary-500">1.</span>{' '}
            <span className="text-dark-300">essa e a chave para pagar com Pix:</span>
          </p>
          <div
            onClick={handleCopy}
            className="flex items-center gap-3 bg-dark-800 border border-dark-600 rounded-xl p-4 cursor-pointer hover:border-primary-500/50 transition-colors"
          >
            <p className="flex-1 text-dark-300 text-sm font-mono truncate">
              {pixCode}
            </p>
            <button className="text-primary-500 flex-shrink-0">
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
          {copied && (
            <p className="text-primary-500 text-xs mt-1 text-center">Copiado!</p>
          )}
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

        <div>
          <p className="text-primary-500 font-semibold mb-2">
            <span className="text-primary-500">2.</span>{' '}
            <span className="text-dark-300">ou escaneie o QR Code abaixo:</span>
          </p>
          {qrCodeUrl && (
            <div className="flex justify-center">
              <div className="bg-white rounded-xl p-3 inline-block">
                <img src={qrCodeUrl} alt="QR Code Pix" className="w-52 h-52" />
              </div>
            </div>
          )}
        </div>

        <div>
          <p className="text-primary-500 font-semibold mb-1">
            <span className="text-primary-500">3.</span>{' '}
            <span className="text-dark-300">pronto! nao esqueca de conferir os valores.</span>
          </p>
          <p className="text-dark-500 text-sm text-center">
            O agendamento sera confirmado automaticamente apos o pagamento.
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-dark-700">
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
