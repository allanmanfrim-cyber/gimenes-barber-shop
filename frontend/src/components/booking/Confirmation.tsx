import { useEffect, useState } from 'react'
import { Appointment } from '../../types'
import { CheckCircle, Copy, Check, Instagram, MapPin, ExternalLink, Star } from 'lucide-react'
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

  const googleMapsUrl = "https://www.google.com/search?q=gimenesbarber+jos%C3%A9+bonif%C3%A1cio&oq=gimenesbarber+jos%C3%A9+bonif%C3%A1cio&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIJCAEQIRgKGKABMgkIAhAhGAoYoAHSAQkxMDE1OWowajeoAgCwAgA&sourceid=chrome&ie=UTF-8#lrd=0x94bdbff4a98cb991:0xe3bae23a182f1c6f,1"

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
    <div className="px-4 py-6 text-center space-y-8 max-w-md mx-auto">
      <div className="space-y-6">
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
              <span className="text-dark-500 text-sm">Serviço</span>
              <span className="text-dark-900 font-medium text-sm">{appointment.service?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-500 text-sm">Barbeiro</span>
              <span className="text-dark-900 font-medium text-sm">{appointment.barber?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-500 text-sm">Data e Hora</span>
              <span className="text-dark-900 font-medium text-sm">{formattedDateTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-500 text-sm">Valor</span>
              <span className="text-green-700 font-semibold text-sm">
                R$ {appointment.service?.price.toFixed(2).replace('.', ',')}
              </span>
            </div>
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

      {/* 2 - Como chegar */}
      <div className="space-y-3">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-4 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-xl font-bold transition-all border border-primary-200"
        >
          <MapPin className="w-5 h-5" />
          Ver no Google Maps
        </a>
      </div>

      {/* 1 - Redes Sociais */}
      <div className="space-y-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <h3 className="text-lg font-bold text-dark-900">Siga nossas redes sociais</h3>
          <p className="text-sm text-dark-500">Fique por dentro das novidades, cortes e promoções 🔥</p>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {[
            { name: 'Gimenes Barber (Oficial)', url: 'https://www.instagram.com/gimenesbarberjr/' },
            { name: 'Juninho Gimenes', url: 'https://www.instagram.com/_juniorgimenes_/' },
            { name: 'Abner', url: 'https://www.instagram.com/barbeiroabner_ofc/' }
          ].map((social) => (
            <a
              key={social.url}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all border border-gray-200 group"
            >
              <Instagram className="w-5 h-5 text-pink-600 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-dark-900">{social.name}</span>
              <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
            </a>
          ))}
        </div>
      </div>

      {/* 3 - Avalie sua experiência */}
      <div className={`p-6 rounded-2xl border-2 transition-all ${
        appointment.status === 'completed' 
          ? 'bg-yellow-50 border-yellow-200 shadow-lg shadow-yellow-100' 
          : 'bg-white border-gray-100'
      }`}>
        <p className="text-sm font-medium text-dark-900 mb-4 flex items-center justify-center gap-2">
          Aproveite para avaliar sua experiência <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
        </p>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block py-3 px-8 bg-white hover:bg-gray-50 text-dark-900 font-bold rounded-lg border border-gray-200 shadow-sm transition-all text-sm"
        >
          Avaliar no Google
        </a>
      </div>

      <div className="space-y-4 pt-4">
        <button
          onClick={onFinish}
          className="w-full py-4 bg-dark-900 hover:bg-dark-800 text-white font-semibold rounded-lg transition-all shadow-lg shadow-dark-900/10"
        >
          Voltar ao Início
        </button>

        {/* 4 - Observação no Rodapé */}
        <p className="text-[10px] text-gray-400 leading-relaxed max-w-[280px] mx-auto italic">
          Observação: Em caso de não comparecimento sem aviso prévio, poderá ser aplicada uma taxa referente ao horário reservado.
        </p>
      </div>
    </div>
  )
}
