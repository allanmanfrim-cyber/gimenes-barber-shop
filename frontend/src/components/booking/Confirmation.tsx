import { useEffect, useState } from 'react'
import { Appointment, PaymentStatus } from '../../types'
import { Button } from '../ui/Button'
import { CheckCircle, Copy, Check, Bell, Mail, MessageSquare, Star, Calendar, User, Scissors, DollarSign } from 'lucide-react'
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
    case 'paid_card': return 'Pago via Cartão'
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
      return 'bg-green-500 text-black'
    case 'pay_on_site':
      return 'bg-primary-500 text-black'
    case 'pending':
      return 'bg-amber-500 text-black'
    case 'cancelled':
      return 'bg-red-500 text-white'
    default:
      return 'bg-neutral-800 text-neutral-400'
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
    ? format(parseISO(appointment.date_time), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })
    : ''

  const paymentStatus = appointment.payment?.status || 'pending'
  const isPayOnSite = paymentStatus === 'pay_on_site'

  return (
    <div className="text-center space-y-8 animate-in fade-in zoom-in-95 duration-700 pb-10">
      <div className="relative mx-auto w-24 h-24">
        <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-2xl animate-pulse" />
        <div className="relative w-24 h-24 bg-neutral-900 border border-primary-500/30 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-primary-500" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-3xl font-black text-white uppercase tracking-tight">
          Agendamento Confirmado!
        </h2>
        <p className="text-neutral-500 font-medium text-sm">
          Seu horário foi reservado com sucesso em nossa agenda.
        </p>
      </div>

      <div className="bg-neutral-900/50 border border-white/[0.03] rounded-3xl p-8 text-left space-y-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
           <Star className="w-20 h-20 text-primary-500" />
        </div>

        <div className="space-y-5 relative z-10">
          <div className="flex items-center justify-between border-b border-white/[0.03] pb-4">
            <div className="flex items-center gap-3">
               <Scissors className="w-4 h-4 text-primary-500" />
               <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest pt-1">Serviço</span>
            </div>
            <span className="text-white font-black uppercase text-sm">{appointment.service?.name}</span>
          </div>

          <div className="flex items-center justify-between border-b border-white/[0.03] pb-4">
            <div className="flex items-center gap-3">
               <User className="w-4 h-4 text-primary-500" />
               <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest pt-1">Barbeiro</span>
            </div>
            <span className="text-white font-black uppercase text-sm">{appointment.barber?.name}</span>
          </div>

          <div className="flex items-center justify-between border-b border-white/[0.03] pb-4">
            <div className="flex items-center gap-3">
               <Calendar className="w-4 h-4 text-primary-500" />
               <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest pt-1">Data e Hora</span>
            </div>
            <span className="text-white font-black uppercase text-sm">{formattedDateTime}</span>
          </div>

          <div className="flex items-center justify-between border-b border-white/[0.03] pb-4">
            <div className="flex items-center gap-3">
               <DollarSign className="w-4 h-4 text-primary-500" />
               <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest pt-1">Valor Total</span>
            </div>
            <span className="text-primary-500 font-black text-xl">
              R$ {appointment.service?.price.toFixed(2).replace('.', ',')}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest pt-1">Status do Pagamento</span>
            </div>
            <span className={`px-4 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-widest ${getPaymentStatusColor(paymentStatus)}`}>
              {getPaymentStatusText(paymentStatus)}
            </span>
          </div>
        </div>
      </div>

      {pixCode && (
        <div className="bg-neutral-900 border border-primary-500/20 rounded-3xl p-8 animate-in slide-in-from-top-4 duration-500">
          <h3 className="text-sm font-black text-white mb-6 uppercase tracking-[0.2em]">
            Pagamento via Pix
          </h3>
          
          {qrCodeUrl && (
            <div className="bg-white rounded-2xl p-4 inline-block mb-6 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
              <img src={qrCodeUrl} alt="QR Code Pix" className="w-48 h-48" />
            </div>
          )}

          <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-4">
            Ou utilize o código Copia e Cola:
          </p>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={pixCode}
              readOnly
              className="flex-1 bg-black border border-white/[0.05] rounded-xl px-4 py-3 text-xs text-neutral-400 truncate focus:outline-none"
            />
            <button
              onClick={handleCopyPix}
              className="w-12 h-12 bg-primary-500 text-black rounded-xl flex items-center justify-center hover:scale-105 transition-all shadow-[0_0_15px_rgba(197,160,89,0.2)]"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>

          <p className="text-[10px] text-primary-500/60 font-bold mt-6 uppercase tracking-widest">
            A confirmação será automática após o pagamento
          </p>
        </div>
      )}

      <div className="bg-neutral-900/30 border border-white/[0.03] rounded-3xl p-6">
        <div className="flex items-center justify-center gap-3 text-neutral-500 mb-4">
          <Bell className="w-4 h-4 text-primary-500" />
          <span className="text-[10px] font-black uppercase tracking-widest pt-1">Notificações Enviadas</span>
        </div>
        <div className="flex justify-center gap-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-neutral-900 rounded-full border border-white/[0.05]">
            <MessageSquare className="w-3.5 h-3.5 text-green-500" />
            <span className="text-[10px] font-black text-white uppercase tracking-tighter">WhatsApp</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-neutral-900 rounded-full border border-white/[0.05]">
            <Mail className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-[10px] font-black text-white uppercase tracking-tighter">E-mail</span>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button fullWidth onClick={onFinish} className="h-16 rounded-full bg-neutral-900 border border-white/[0.05] text-white font-black uppercase tracking-[0.2em] text-xs hover:border-primary-500 transition-all">
          Concluir e Voltar
        </Button>
      </div>
    </div>
  )
}
