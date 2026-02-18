import { useEffect, useState } from 'react'
import { Appointment, PaymentStatus } from '../../types'
import { Button } from '../ui/Button'
import { CheckCircle, Copy, Check, Bell, Mail, MessageSquare, Instagram, MapPin, Star } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import QRCode from 'qrcode'

interface ConfirmationProps {
  appointment: Appointment
  pixCode?: string
  pixQrCodeBase64?: string
  onFinish: () => void
}

const SOCIAL_LINKS = [
  { name: 'Gimenes Barber (Oficial)', url: 'https://www.instagram.com/gimenesbarberjr/' },
  { name: 'Juninho Gimenes', url: 'https://www.instagram.com/_juniorgimenes_/' },
  { name: 'Abner', url: 'https://www.instagram.com/barbeiroabner_ofc/' }
]

const GOOGLE_MAPS_LINK = "https://www.google.com/search?q=gimenesbarber+jos%C3%A9+bonif%C3%A1cio&oq=gimenesbarber+jos%C3%A9+bonif%C3%A1cio&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIJCAEQIRgKGKABMgkIAhAhGAoYoAHSAQkxMDE1OWowajeoAgCwAgA&sourceid=chrome&ie=UTF-8#lrd=0x94bdbff4a98cb991:0xe3bae23a182f1c6f,1"

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
    <div className="text-center space-y-6 max-w-md mx-auto">
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
        <p className="text-sm text-dark-500 mt-1">
          Rua Ademar de Barros, 278 - Centro - Jose Bonifacio/SP
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
        </div>
      )}

      {/* Siga nossas redes sociais */}
      <div className="bg-dark-800 border border-dark-700 rounded-xl p-4 text-left space-y-4">
        <div>
          <h3 className="text-white font-bold flex items-center gap-2">
            <Instagram className="w-4 h-4 text-pink-500" />
            Siga nossas redes sociais
          </h3>
          <p className="text-xs text-dark-400">Fique por dentro das novidades, cortes e promocoes 🔥</p>
        </div>
        <div className="grid gap-2">
          {SOCIAL_LINKS.map(social => (
            <a 
              key={social.url}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2 rounded-lg bg-dark-700 hover:bg-dark-600 transition-colors group"
            >
              <span className="text-sm text-dark-200">{social.name}</span>
              <Instagram className="w-4 h-4 text-dark-400 group-hover:text-pink-500 transition-colors" />
            </a>
          ))}
        </div>
      </div>

      {/* Como chegar & Avaliar */}
      <div className="grid grid-cols-2 gap-3">
        <a 
          href={GOOGLE_MAPS_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-2 p-4 rounded-xl bg-dark-800 border border-dark-700 hover:border-primary-500/50 transition-colors"
        >
          <MapPin className="w-6 h-6 text-primary-500" />
          <span className="text-xs text-white font-medium">Como chegar</span>
        </a>
        <a 
          href={GOOGLE_MAPS_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-2 p-4 rounded-xl bg-dark-800 border border-dark-700 hover:border-primary-500/50 transition-colors"
        >
          <Star className="w-6 h-6 text-yellow-500" />
          <span className="text-xs text-white font-medium">Avaliar no Google</span>
        </a>
      </div>

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
      </div>

      <Button fullWidth onClick={onFinish}>
        Voltar ao Inicio
      </Button>

      <p className="text-[10px] text-dark-500 text-center uppercase tracking-widest">
        Observacao: Em caso de nao comparecimento sem aviso previo, podera ser aplicada uma taxa referente ao horario reservado.
      </p>
    </div>
  )
}
