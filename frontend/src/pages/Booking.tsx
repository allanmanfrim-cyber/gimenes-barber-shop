import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { useBooking } from '../hooks/useBooking'
import { ServiceSelect } from '../components/booking/ServiceSelect'
import { BarberSelect } from '../components/booking/BarberSelect'
import { DateTimeSelect } from '../components/booking/DateTimeSelect'
import { ClientForm } from '../components/booking/ClientForm'
import { ReferenceImageUpload } from '../components/booking/ReferenceImageUpload'
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
    confirmClientInfo,
    setReferenceImages,
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

  const stepTitles: Record<number | string, string> = {
    1: 'Barbeiro',
    2: 'Serviço',
    3: 'Data e Horário',
    4: 'Seus Dados',
    4.5: 'Fotos de Referência',
    5: 'Pagamento',
    6: 'Pagamento via Pix',
    7: 'Pagamento via Nubank',
    8: 'Adicionar Cartão',
    9: 'Confirmação'
  }

  const handleBack = () => {
    if (step === 1) {
      navigate('/')
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
        
        {showStepper && <BookingStepper currentStep={step > 4 ? Math.floor(Number(step)) + 1 : Number(step)} totalSteps={6} />}
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {step === 1 && (
        <BarberSelect
          barbers={barbers}
          loading={loading}
          onSelect={selectBarber}
        />
      )}

      {step === 2 && (
        <ServiceSelect
          services={services}
          loading={loading}
          onSelect={selectService}
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
          initialBirthDate={bookingData.clientBirthDate}
          initialNotes={bookingData.notes}
          onSubmit={(name, whatsapp, email, birthDate, notes) => {
            setClientInfo(name, whatsapp, email, birthDate, notes)
            confirmClientInfo()
          }}
        />
      )}

      {step === 4.5 && (
        <ReferenceImageUpload
          onImagesSelected={setReferenceImages}
          onNext={() => {
            // Ir para o passo 5 (Pagamento)
            setPaymentMethod('pix', 'online')
          }}
          onBack={handleBack}
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
          pixCode={appointmentResult.pixCode}
          pixQrCodeBase64={appointmentResult.pixQrCodeBase64}
          onFinish={handleFinish}
        />
      )}
    </Layout>
  )
}
