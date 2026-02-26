import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { useBooking } from '../hooks/useBooking'
import { ServiceSelect } from '../components/booking/ServiceSelect'
import { BarberSelect } from '../components/booking/BarberSelect'
import { DateTimeSelect } from '../components/booking/DateTimeSelect'
import { ClientForm } from '../components/booking/ClientForm'
import { PaymentSelect } from '../components/booking/PaymentSelect'
import { PaymentScreen } from '../components/booking/PaymentScreen'
import { FinalScreen } from '../components/booking/FinalScreen'
import { BookingStepper } from '../components/booking/BookingStepper'
import { ArrowLeft, X } from 'lucide-react'

export default function Booking() {
  const navigate = useNavigate()

  const {
    step,
    setStep,
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
    goBack,
    reset
  } = useBooking()

  useEffect(() => {
    loadServices()
    loadBarbers()
  }, [loadServices, loadBarbers])

  const stepTitles = [
    'Serviço',
    'Barbeiro',
    'Data e Horário',
    'Seus Dados',
    'Pagamento',
    'Finalizar Pagamento',
    'Concluído'
  ]

  const handleBack = () => {
    if (step === 1) navigate('/')
    else goBack()
  }

  const handleCancel = () => {
    if (window.confirm('Deseja cancelar o agendamento e voltar ao início?')) {
      reset()
      navigate('/')
    }
  }

  const handleFinish = () => {
    reset()
    navigate('/')
  }

  return (
    <Layout showHeader={false}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          {step < 7 && (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-dark-400 hover:text-white border border-dark-700 rounded-lg px-3 py-1.5 bg-dark-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Voltar</span>
            </button>
          )}

          {step > 1 && step < 7 && (
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 text-red-400 hover:text-red-300 px-3 py-1.5"
            >
              <X className="w-4 h-4" />
              <span className="text-sm font-medium">Cancelar</span>
            </button>
          )}
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">
          {stepTitles[step - 1]}
        </h2>

        <BookingStepper currentStep={step} totalSteps={7} />
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
          initialBirthDate={bookingData.clientBirthDate}
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
        <PaymentScreen
          appointmentResult={appointmentResult}
          bookingData={bookingData}
          onPaymentConfirmed={() => setStep(7)}
        />
      )}

      {step === 7 && appointmentResult && (
        <FinalScreen
          appointmentResult={appointmentResult}
          onFinish={handleFinish}
        />
      )}
    </Layout>
  )
}