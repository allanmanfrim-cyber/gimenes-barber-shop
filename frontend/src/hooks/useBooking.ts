import { useState, useCallback } from 'react'
import {
  BookingData,
  Service,
  Barber,
  TimeSlot,
  PaymentMethod,
  PaymentType
} from '../types'
import { api } from '../services/api'
import { format } from 'date-fns'

const initialBookingData: BookingData = {
  service: null,
  barber: null,
  date: '',
  time: '',
  clientName: '',
  clientWhatsapp: '',
  clientEmail: '',
  clientBirthDate: '',
  notes: '',
  referenceImages: [],
  paymentMethod: 'pix',
  paymentType: 'online'
}

export function useBooking() {
  const [step, setStep] = useState(1)
  const [bookingData, setBookingData] =
    useState<BookingData>(initialBookingData)
  const [services, setServices] = useState<Service[]>([])
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [appointmentResult, setAppointmentResult] = useState<any>(null)

  const loadServices = useCallback(async () => {
    setLoading(true)
    try {
      const { services } = await api.services.list()
      setServices(services.filter(s => s.active))
    } catch {
      setError('Erro ao carregar serviços')
    } finally {
      setLoading(false)
    }
  }, [])

  const loadBarbers = useCallback(async () => {
    setLoading(true)
    try {
      const { barbers } = await api.barbers.list()
      setBarbers(barbers.filter(b => b.active))
    } catch {
      setError('Erro ao carregar barbeiros')
    } finally {
      setLoading(false)
    }
  }, [])

  const loadAvailability = useCallback(
    async (barberId: string | 'any', date: Date) => {
      if (!bookingData.service) return

      setLoading(true)
      try {
        const dateStr = format(date, 'yyyy-MM-dd')
        const { slots } = await api.availability.get(
          barberId,
          dateStr,
          bookingData.service.id
        )
        setTimeSlots(slots)
        setBookingData(prev => ({ ...prev, date: dateStr }))
      } catch {
        setError('Erro ao carregar horários')
      } finally {
        setLoading(false)
      }
    },
    [bookingData.service]
  )

  const selectService = (service: Service) => {
    setBookingData(prev => ({ ...prev, service }))
    setStep(2)
  }

  const selectBarber = (barber: Barber | null) => {
    setBookingData(prev => ({ ...prev, barber }))
    setStep(3)
  }

  const selectDateTime = (date: string, time: string) => {
    setBookingData(prev => ({ ...prev, date, time }))
    setStep(4)
  }

  const setClientInfo = (
    name: string,
    whatsapp: string,
    email: string,
    birthDate: string,
    notes: string
  ) => {
    setBookingData(prev => ({
      ...prev,
      clientName: name,
      clientWhatsapp: whatsapp,
      clientEmail: email,
      clientBirthDate: birthDate,
      notes
    }))
    setStep(5)
  }

  const setPaymentMethod = (method: PaymentMethod, type?: PaymentType) => {
    setBookingData(prev => ({
      ...prev,
      paymentMethod: method,
      ...(type !== undefined && { paymentType: type })
    }))
  }

  const submitBooking = async () => {
    if (!bookingData.service || !bookingData.date || !bookingData.time) {
      setError('Dados incompletos')
      return false
    }

    setLoading(true)
    setError(null)

    try {
      const dateTime = `${bookingData.date}T${bookingData.time}:00`

      const result = await api.appointments.create({
        serviceId: bookingData.service.id,
        barberId: bookingData.barber?.id || 'any',
        dateTime,
        clientName: bookingData.clientName,
        clientWhatsapp: bookingData.clientWhatsapp,
        clientEmail: bookingData.clientEmail,
        clientBirthDate: bookingData.clientBirthDate,
        notes: bookingData.notes,
        referenceImages: bookingData.referenceImages,
        paymentMethod: bookingData.paymentMethod
      })

      setAppointmentResult(result)
      setStep(6)

      return true
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao criar agendamento'
      )
      return false
    } finally {
      setLoading(false)
    }
  }

  const goBack = () => {
    if (step > 1) setStep(prev => prev - 1)
  }

  const reset = () => {
    setStep(1)
    setBookingData(initialBookingData)
    setAppointmentResult(null)
    setError(null)
  }

  return {
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
  }
}