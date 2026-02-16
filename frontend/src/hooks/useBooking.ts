import { useState, useCallback } from 'react'
import { BookingData, Service, Barber, TimeSlot } from '../types'
import { api } from '../services/api'
import { format } from 'date-fns'

const initialBookingData: BookingData = {
  services: [],
  barber: null,
  date: '',
  time: '',
  clientName: '',
  clientWhatsapp: '',
  notes: '',
  paymentMethod: 'local'
}

export function useBooking() {
  const [step, setStep] = useState(1)
  const [bookingData, setBookingData] = useState<BookingData>(initialBookingData)
  const [services, setServices] = useState<Service[]>([])
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [appointmentResult, setAppointmentResult] = useState<{
    appointment: import('../types').Appointment
    pixCode?: string
  } | null>(null)

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

  const loadAvailability = useCallback(async (barberId: number | 'any', date: Date) => {
    if (bookingData.services.length === 0) return
    setLoading(true)
    try {
      const dateStr = format(date, 'yyyy-MM-dd')
      const { slots } = await api.availability.get(barberId, dateStr, bookingData.services[0].id)
      setTimeSlots(slots)
      setBookingData(prev => ({ ...prev, date: dateStr }))
    } catch {
      setError('Erro ao carregar horários')
    } finally {
      setLoading(false)
    }
  }, [bookingData.services])

  const selectBarber = (barber: Barber | null) => {
    setBookingData(prev => ({ ...prev, barber }))
    setStep(2)
  }

  const toggleService = (service: Service) => {
    setBookingData(prev => {
      const exists = prev.services.some(s => s.id === service.id)
      if (exists) {
        return { ...prev, services: prev.services.filter(s => s.id !== service.id) }
      } else {
        return { ...prev, services: [...prev.services, service] }
      }
    })
  }

  const confirmServices = () => {
    if (bookingData.services.length > 0) {
      setStep(3)
    }
  }

  const selectDateTime = (date: string, time: string) => {
    setBookingData(prev => ({ ...prev, date, time }))
    setStep(4)
  }

  const setClientInfo = (name: string, whatsapp: string, notes: string) => {
    setBookingData(prev => ({ 
      ...prev, 
      clientName: name, 
      clientWhatsapp: whatsapp,
      notes 
    }))
  }

  const confirmClientInfo = () => {
    setStep(5)
  }

  const setPaymentMethod = (method: 'pix' | 'local') => {
    setBookingData(prev => ({ ...prev, paymentMethod: method }))
  }

  const submitBooking = async (paymentMethod: 'pix' | 'card') => {
    if (bookingData.services.length === 0 || !bookingData.date || !bookingData.time) {
      setError('Dados incompletos')
      return false
    }

    setLoading(true)
    setError(null)

    try {
      const dateTime = `${bookingData.date}T${bookingData.time}:00`
      const result = await api.appointments.create({
        serviceId: bookingData.services[0].id,
        barberId: bookingData.barber?.id || 'any',
        dateTime,
        clientName: bookingData.clientName,
        clientWhatsapp: bookingData.clientWhatsapp,
        notes: bookingData.notes,
        paymentMethod: paymentMethod === 'pix' ? 'pix' : 'local'
      })
      setAppointmentResult(result)
      setStep(6)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar agendamento')
      return false
    } finally {
      setLoading(false)
    }
  }

  const goBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const reset = () => {
    setStep(1)
    setBookingData(initialBookingData)
    setAppointmentResult(null)
    setError(null)
  }

  const getTotalPrice = () => {
    return bookingData.services.reduce((acc, s) => acc + s.price, 0)
  }

  const getTotalDuration = () => {
    return bookingData.services.reduce((acc, s) => acc + s.duration_minutes, 0)
  }

  return {
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
    setPaymentMethod,
    submitBooking,
    goBack,
    reset,
    getTotalPrice,
    getTotalDuration
  }
}
