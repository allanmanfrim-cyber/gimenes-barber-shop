import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { useBooking } from '../hooks/useBooking'
import { ServiceSelect } from '../components/booking/ServiceSelect'
import { BarberSelect } from '../components/booking/BarberSelect'
import { DateTimeSelect } from '../components/booking/DateTimeSelect'
import { ClientForm } from '../components/booking/ClientForm'
import { PaymentSelect } from '../components/booking/PaymentSelect'
import { PixPayment } from '../components/booking/PixPayment'
import { NubankPayment } from '../components/booking/NubankPayment'
import { CardForm } from '../components/booking/CardForm'
import { Confirmation } from '../components/booking/Confirmation'
import { BookingStepper } from '../components/booking/BookingStepper'
import { ArrowLeft } from 'lucide-react'

export default function Booking() {
  const navigate = useNavigate()
  const {
    step,
    bookingData,
    services,
    barbers,
    timeSlots,
    loading,
    error,
    appointmentResult,
    loadServices,
    loadBarbers,
    loadAvailability,
    selectService,
    selectBarber,
    selectDateTime,
    setClientInfo,
    setPaymentMethod,
    submitBooking,
    goToConfirmation,
    goBack,
    reset
  } = useBooking()

  useEffect(() => {
    loadServices()
    loadBarbers()
  }, [loadServices, loadBarbers])

  const stepTitles: Record<number, string> = {
    1: 'Servico',
    2: 'Barbeiro',
    3: 'Data e Horario',
    4: 'Seus Dados',
    5: 'Pagamento',
    6: 'Pagamento via Pix',
    7: 'Pagamento via Nubank',
    8: 'Adicionar Cartao',
    9: 'Confirmacao'
  }

  const handleBack = () => {
    if (step === 1) {
      navigate('/')
    } else if (step >= 6 && step <= 8) {
      goBack()
    } else {
      goBack()
    }
  }

  const handleFinish = () => {
    reset()
    navigate('/')
  }

  const handlePaymentConfirmed = () => {
    goToConfirmation()
  }

  const handlePaymentCancel = () => {
    goBack()
  }

  const handleCardSubmit = async () => {
    goToConfirmation()
  }

  const showStepper = step <= 5
  const showBackButton = step <= 5
  const showTitle = step <= 5

  return (
    <Layout showHeader={false}>
      <div className="mb-6">
        {showBackButton && (
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-dark-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
        )}
        
        {showTitle && (
          <h2 className="text-2xl font-bold text-white mb-2">
            {stepTitles[step] || ''}
          </h2>
        )}
        
        {showStepper && <BookingStepper currentStep={Math.min(step, 5)} totalSteps={5} />}
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {step === 1 && (
        <ServiceSelect
          services={services}
          loading={loading}
          onSelect={selectService}
        />
      )}

      {step === 2 && (
        <BarberSelect
          barbers={barbers}
          loading={loading}
          onSelect={selectBarber}
        />
      )}

      {step === 3 && (
        <DateTimeSelect
          selectedBarber={bookingData.barber}
          selectedDate={bookingData.date}
          selectedTime={bookingData.time}
          timeSlots={timeSlots}
          loading={loading}
          onLoadAvailability={loadAvailability}
          onSelectDateTime={selectDateTime}
        />
      )}

      {step === 4 && (
        <ClientForm
          initialName={bookingData.clientName}
          initialWhatsapp={bookingData.clientWhatsapp}
          initialEmail={bookingData.clientEmail}
          initialNotes={bookingData.notes}
          onSubmit={setClientInfo}
        />
      )}

      {step === 5 && (
        <PaymentSelect
          bookingData={bookingData}
          loading={loading}
          onSelectPayment={setPaymentMethod}
          onSubmit={submitBooking}
        />
      )}

      {step === 6 && appointmentResult && (
        <PixPayment
          pixCode={appointmentResult.pixCode || ''}
          pixQrCodeBase64={appointmentResult.pixQrCodeBase64}
          amount={bookingData.service?.price || 0}
          appointmentId={appointmentResult.appointment.id}
          onConfirmed={handlePaymentConfirmed}
          onCancel={handlePaymentCancel}
          onBack={handlePaymentCancel}
        />
      )}

      {step === 7 && appointmentResult && (
        <NubankPayment
          pixCode={appointmentResult.pixCode || ''}
          amount={bookingData.service?.price || 0}
          appointmentId={appointmentResult.appointment.id}
          onConfirmed={handlePaymentConfirmed}
          onCancel={handlePaymentCancel}
          onBack={handlePaymentCancel}
        />
      )}

      {step === 8 && appointmentResult && (
        <CardForm
          amount={bookingData.service?.price || 0}
          loading={loading}
          onSubmit={handleCardSubmit}
          onBack={handlePaymentCancel}
        />
      )}

      {step === 9 && appointmentResult && (
        <Confirmation
          appointment={appointmentResult.appointment}
          pixCode={undefined}
          pixQrCodeBase64={undefined}
          onFinish={handleFinish}
        />
      )}
    </Layout>
  )
}
