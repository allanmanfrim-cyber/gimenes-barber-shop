import { useEffect, useState } from 'react'
import { Appointment } from '../../types'
import { CheckCircle, Copy, Check } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import QRCode from 'qrcode'

interface ConfirmationProps {
  appointment: Appointment
  pixCode?: string
  onFinish: () => void
}

export function Confirmation({ appointment, pixCode, onFinish }: ConfirmationProps) {
  const [copied, setCopied] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')

  useEffect(() => {
    if (pixCode) {
      QRCode.toDataURL(pixCode, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      }).then(setQrCodeUrl)
    }
  }, [pixCode])

  const handleCopyPix = async () => {
    if (pixCode) {
      await navigator.clipboard.writeText(pixCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formattedDateTime = appointment.date_time
    ? format(parseISO(appointment.date_time), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })
    : ''

  return (
    <div className="px-4 py-6 text-center space-y-6">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-dark-900 mb-2">
          Agendamento Confirmado!
        </h2>
        <p className="text-dark-500">
          Seu horário foi reservado com sucesso
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-left">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-dark-500">Serviço</span>
            <span className="text-dark-900 font-medium">{appointment.service?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-500">Barbeiro</span>
            <span className="text-dark-900 font-medium">{appointment.barber?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-500">Data e Hora</span>
            <span className="text-dark-900 font-medium">{formattedDateTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-500">Valor</span>
            <span className="text-green-700 font-semibold">
              R$ {appointment.service?.price.toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>
      </div>

      {pixCode && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-dark-900 mb-4">
            Pagamento via Pix
          </h3>
          
          {qrCodeUrl && (
            <div className="bg-white rounded-lg p-2 inline-block mb-4 border border-gray-200">
              <img src={qrCodeUrl} alt="QR Code Pix" className="w-48 h-48" />
            </div>
          )}

          <p className="text-sm text-dark-500 mb-3">
            Ou copie o código abaixo:
          </p>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={pixCode}
              readOnly
              className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-dark-600 truncate"
            />
            <button
              onClick={handleCopyPix}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-dark-600" />}
            </button>
          </div>
        </div>
      )}

      <button
        onClick={onFinish}
        className="w-full py-4 bg-dark-900 hover:bg-dark-800 text-white font-semibold rounded-lg transition-all"
      >
        Voltar ao Início
      </button>
    </div>
  )
}
