import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { useBooking } from '../hooks/useBooking'
import { ServiceSelect } from '../components/booking/ServiceSelect'
import { BarberSelect } from '../components/booking/BarberSelect'
import { DateTimeSelect } from '../components/booking/DateTimeSelect'
import { ClientForm } from '../components/booking/ClientForm'
import { PaymentSelect } from '../components/booking/PaymentSelect'
import { Confirmation } from '../components/booking/Confirmation'
import { BookingStepper } from '../components/booking/BookingStepper'
import { ArrowRight } from 'lucide-react'

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
    toggleService,
    confirmServices,
    selectBarber,
    selectDateTime,
    setClientInfo,
    confirmClientInfo,
    submitBooking,
    goBack,
    reset,
    getTotalPrice,
    getTotalDuration
  } = useBooking()

  const [localBarber, setLocalBarber] = useState(bookingData.barber)
  const [localDate, setLocalDate] = useState(bookingData.date)
  const [localTime, setLocalTime] = useState(bookingData.time)

  useEffect(() => {
    loadServices()
    loadBarbers()
  }, [loadServices, loadBarbers])

  const stepTitles = [
    'Escolha seu barbeiro',
    'Escolha os serviços',
    'Escolha data e horário',
    'Confirme seus dados',
    'Forma de pagamento',
    'Confirmação'
  ]

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

  const canContinue = () => {
    switch (step) {
      case 1: return localBarber !== null
      case 2: return bookingData.services.length > 0
      case 3: return localDate && localTime
      default: return false
    }
  }

  const handleContinue = () => {
    switch (step) {
      case 1:
        if (localBarber) selectBarber(localBarber)
        break
      case 2:
        confirmServices()
        break
      case 3:
        if (localDate && localTime) selectDateTime(localDate, localTime)
        break
    }
  }

  return (
    <Layout showHeader={true} showBackButton={step < 6} onBack={handleBack}>
      {step < 6 && (
        <BookingStepper 
          currentStep={step} 
          totalSteps={5} 
          stepTitle={stepTitles[step - 1]}
        />
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mx-4 mt-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="pb-28">
        {step === 1 && (
          <BarberSelect
            barbers={barbers}
            selectedBarber={localBarber}
            loading={loading}
            onSelect={setLocalBarber}
          />
        )}

        {step === 2 && (
          <ServiceSelect
            services={services}
            selectedServices={bookingData.services}
            loading={loading}
            onToggle={toggleService}
          />
        )}

        {step === 3 && (
          <DateTimeSelect
            selectedBarber={bookingData.barber}
            selectedServices={bookingData.services}
            selectedDate={localDate}
            selectedTime={localTime}
            timeSlots={timeSlots}
            loading={loading}
            onLoadAvailability={loadAvailability}
            onSelectDate={setLocalDate}
            onSelectTime={setLocalTime}
          />
        )}

        {step === 4 && (
          <ClientForm
            initialName={bookingData.clientName}
            initialWhatsapp={bookingData.clientWhatsapp}
            initialNotes={bookingData.notes}
            bookingData={{
              services: bookingData.services,
              barber: bookingData.barber,
              date: bookingData.date,
              time: bookingData.time
            }}
            onSubmit={(name, whatsapp, notes) => {
              setClientInfo(name, whatsapp, notes)
              confirmClientInfo()
            }}
          />
        )}

        {step === 5 && (
          <PaymentSelect
            bookingData={{
              services: bookingData.services,
              barber: bookingData.barber,
              date: bookingData.date,
              time: bookingData.time,
              clientName: bookingData.clientName
            }}
            loading={loading}
            onSubmit={submitBooking}
          />
        )}

        {step === 6 && appointmentResult && (
          <Confirmation
            appointment={appointmentResult.appointment}
            pixCode={appointmentResult.pixCode}
            onFinish={handleFinish}
          />
        )}
      </div>

      {step < 4 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="max-w-lg mx-auto">
            {step === 2 && bookingData.services.length > 0 && (
              <div className="flex justify-between text-sm mb-3 text-dark-600">
                <span>{bookingData.services.length} serviço(s) • {getTotalDuration()} min</span>
                <span className="font-semibold">R$ {getTotalPrice().toFixed(2).replace('.', ',')}</span>
              </div>
            )}
            <button
              onClick={handleContinue}
              disabled={!canContinue()}
              className={`w-full py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                canContinue()
                  ? 'bg-dark-900 text-white hover:bg-dark-800'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Continuar
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </Layout>
  )
}
