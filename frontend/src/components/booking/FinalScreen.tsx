import { Button } from '../ui/Button'
import { CheckCircle } from 'lucide-react'

interface FinalScreenProps {
  appointmentResult: any
  onFinish: () => void
}

export function FinalScreen({
  appointmentResult,
  onFinish
}: FinalScreenProps) {
  const appointment = appointmentResult?.appointment

  return (
    <div className="text-center space-y-8 animate-in fade-in zoom-in-95 duration-700">

      <div className="mx-auto w-24 h-24 bg-primary-500/20 rounded-full flex items-center justify-center">
        <CheckCircle className="w-12 h-12 text-primary-500" />
      </div>

      <div className="space-y-2">
        <h2 className="text-3xl font-black text-white uppercase">
          Pagamento Confirmado!
        </h2>

        <p className="text-neutral-500 text-sm">
          Seu agendamento foi concluído com sucesso.
        </p>
      </div>

      {appointment && (
        <div className="text-sm text-neutral-400 space-y-1">
          <p><strong>Serviço:</strong> {appointment.service?.name}</p>
          <p><strong>Data:</strong> {appointment.date_time}</p>
          <p><strong>Status:</strong> {appointment.status}</p>
        </div>
      )}

      <div className="space-y-4 text-sm text-neutral-400">
        <p>Aproveite para seguir nossas redes sociais.</p>
        <p>Avalie nossos serviços no Google.</p>
        <p>Use o botão abaixo para ver como chegar.</p>
      </div>

      <Button fullWidth onClick={onFinish}>
        Concluir e Voltar
      </Button>

    </div>
  )
}