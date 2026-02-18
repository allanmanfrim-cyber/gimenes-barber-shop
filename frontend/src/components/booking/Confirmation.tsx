import { useEffect, useState } from 'react'
import { Appointment, PaymentStatus } from '../../types'
import { Button } from '../ui/Button'
import { CheckCircle, Copy, Check, Bell, Mail, MessageSquare } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import QRCode from 'qrcode'

interface ConfirmationProps {
  appointment: Appointment
  pixCode?: string
  pixQrCodeBase64?: string
  onFinish: () => void
}

function getPaymentStatusText(status: PaymentStatus): string {
  switch (status) {
    case 'paid_pix': return 'Pago via Pix'
    case 'paid_card': return 'Pago via Cartao'
    case 'pay_on_site': return 'Pagar no local'
    case 'pending': return 'Aguardando pagamento'
    case 'cancelled': return 'Cancelado'
    default: return status
  }
}

function getPaymentStatusColor(status: PaymentStatus): string {
  switch (status) {
    case 'paid_pix':
    case 'paid_card':
      return 'bg-green-500/20 text-green-400'
    case 'pay_on_site':
      return 'bg-blue-500/20 text-blue-400'
    case 'pending':
      return 'bg-yellow-500/20 text-yellow-400'
    case 'cancelled':
      return 'bg-red-500/20 text-red-400'
    default:
      return 'bg-dark-600 text-dark-400'
  }
}

export function Confirmation({ appointment, pixCode, pixQrCodeBase64, onFinish }: ConfirmationProps) {
  const [copied, setCopied] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')

  useEffect(() => {
    if (pixQrCodeBase64) {
      setQrCodeUrl(`data:image/png;base64,${pixQrCodeBase64}`)
    } else if (pixCode) {
      QRCode.toDataURL(pixCode, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      }).then(setQrCodeUrl)
    }
  }, [pixCode, pixQrCodeBase64])

  const handleCopyPix = async () => {
    if (pixCode) {
      await navigator.clipboard.writeText(pixCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formattedDateTime = appointment.date_time
    ? format(parseISO(appointment.date_time), "dd 'de' MMMM 'as' HH:mm", { locale: ptBR })
    : ''

  const paymentStatus = appointment.payment?.status || 'pending'
  const isPayOnSite = paymentStatus === 'pay_on_site'

  return (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-10 h-10 text-green-500" />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Agendamento Confirmado!
        </h2>
        <p className="text-dark-400">
          Seu horario foi reservado com sucesso
        </p>
      </div>

      <div className="bg-dark-800 border border-dark-700 rounded-xl p-4 text-left">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-dark-400">Servico</span>
            <span className="text-white font-medium">{appointment.service?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-400">Barbeiro</span>
            <span className="text-white font-medium">{appointment.barber?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-400">Data e Hora</span>
            <span className="text-white font-medium">{formattedDateTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-400">Valor</span>
            <span className="text-primary-500 font-semibold">
              R$ {appointment.service?.price.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-dark-400">Pagamento</span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(paymentStatus)}`}>
              {getPaymentStatusText(paymentStatus)}
            </span>
          </div>
        </div>
      </div>

      {pixCode && (
        <div className="bg-dark-800 border border-dark-700 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-white mb-4">
            Pagamento via Pix
          </h3>
          
          {qrCodeUrl && (
            <div className="bg-white rounded-lg p-2 inline-block mb-4">
              <img src={qrCodeUrl} alt="QR Code Pix" className="w-48 h-48" />
            </div>
          )}

          <p className="text-sm text-dark-400 mb-3">
            Ou copie o codigo abaixo:
          </p>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={pixCode}
              readOnly
              className="flex-1 bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-sm text-dark-300 truncate"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopyPix}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>

          <p className="text-xs text-dark-500 mt-3">
            Apos o pagamento, voce recebera a confirmacao automaticamente
          </p>
        </div>
      )}

      <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-4">
        <div className="flex items-center gap-2 text-dark-300 mb-2">
          <Bell className="w-4 h-4 text-primary-500" />
          <span className="text-sm font-medium">Notificacoes enviadas</span>
        </div>
        <div className="flex justify-center gap-4 text-sm text-dark-400">
          <div className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp</span>
          </div>
          <div className="flex items-center gap-1">
            <Mail className="w-4 h-4" />
            <span>E-mail</span>
          </div>
        </div>
        <p className="text-xs text-dark-500 mt-2">
          {isPayOnSite 
            ? 'Voce recebera lembretes antes do seu horario'
            : 'Voce recebera a confirmacao apos o pagamento ser processado'
          }
        </p>
      </div>

      <Button fullWidth onClick={onFinish}>
        Voltar ao Inicio
      </Button>
    </div>
  )
}
