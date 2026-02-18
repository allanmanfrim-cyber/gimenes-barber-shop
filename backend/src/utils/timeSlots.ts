import { BusinessHoursModel } from '../models/BusinessHours.js'
import { AppointmentModel } from '../models/Appointment.js'
import { BarberModel } from '../models/Barber.js'

export interface TimeSlot {
  time: string
  available: boolean
}

export function generateTimeSlots(
  date: string,
  barberId: number | 'any',
  serviceDuration: number
): TimeSlot[] {
  const targetDate = new Date(date + 'T12:00:00')
  const dayOfWeek = targetDate.getDay()
  
  const businessHours = BusinessHoursModel.findByDay(dayOfWeek)
  if (!businessHours || !businessHours.is_open) {
    return []
  }

  const slots: TimeSlot[] = []
  const [openHour, openMin] = businessHours.open_time.split(':').map(Number)
  const [closeHour, closeMin] = businessHours.close_time.split(':').map(Number)

  const now = new Date()
  const isToday = targetDate.toDateString() === now.toDateString()

  let barberIds: number[]
  if (barberId === 'any') {
    const activeBarbers = BarberModel.findAll(true)
    barberIds = activeBarbers.map(b => b.id)
  } else {
    barberIds = [barberId]
  }

  for (let hour = openHour; hour < closeHour || (hour === closeHour && openMin < closeMin); hour++) {
    for (let min = 0; min < 60; min += 30) {
      if (hour === openHour && min < openMin) continue
      
      const slotEndMin = min + serviceDuration
      const slotEndHour = hour + Math.floor(slotEndMin / 60)
      const slotEndMinute = slotEndMin % 60
      
      if (slotEndHour > closeHour || (slotEndHour === closeHour && slotEndMinute > closeMin)) {
        continue
      }

      const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`
      
      if (isToday) {
        const slotTime = new Date(targetDate)
        slotTime.setHours(hour, min, 0, 0)
        if (slotTime <= now) continue
      }

      let available = false
      for (const bid of barberIds) {
        const dateTime = `${date}T${timeStr}:00`
        const conflicts = AppointmentModel.findConflicts(bid, dateTime, serviceDuration)
        if (conflicts.length === 0) {
          available = true
          break
        }
      }

      slots.push({ time: timeStr, available })
    }
  }

  return slots
}

export function findAvailableBarber(
  date: string,
  time: string,
  serviceDuration: number
): number | null {
  const activeBarbers = BarberModel.findAll(true)
  const dateTime = `${date}T${time}:00`

  for (const barber of activeBarbers) {
    const conflicts = AppointmentModel.findConflicts(barber.id, dateTime, serviceDuration)
    if (conflicts.length === 0) {
      return barber.id
    }
  }

  return null
}
