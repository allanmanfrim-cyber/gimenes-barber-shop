import { BookingData } from '../../types'
import { PixPayment } from './PixPayment'
import { NubankPayment } from './NubankPayment'

interface PaymentScreenProps {
  appointmentResult: any
  bookingData: BookingData
  onPaymentConfirmed: () => void
}

export function PaymentScreen({
  appointmentResult,
  bookingData,
  onPaymentConfirmed
}: PaymentScreenProps) {
  const { paymentMethod } = bookingData

  if (paymentMethod === 'pix') {
    return (
      <PixPayment
        pixCode={appointmentResult.pixCode}
        pixQrCodeBase64={appointmentResult.pixQrCodeBase64}
        amount={appointmentResult.appointment?.service?.price || 0}
        appointmentId={appointmentResult.appointment.id}
        onConfirmed={onPaymentConfirmed}
        onCancel={() => window.location.reload()}
        onBack={() => window.location.reload()}
      />
    )
  }

  if (paymentMethod === 'nubank') {
    return (
      <NubankPayment
        appointmentId={appointmentResult.appointment.id}
        amount={appointmentResult.appointment?.service?.price || 0}
        onConfirmed={onPaymentConfirmed}
        onCancel={() => window.location.reload()}
      />
    )
  }

  return (
    <div className="text-center text-white">
      <h2 className="text-xl font-bold mb-4">Pagamento Presencial</h2>
      <p className="text-dark-300 mb-6">
        Seu agendamento foi registrado. O pagamento será realizado no salão.
      </p>
      <button
        onClick={onPaymentConfirmed}
        className="bg-primary-500 text-black px-6 py-3 rounded-lg font-bold"
      >
        Finalizar
      </button>
    </div>
  )
}