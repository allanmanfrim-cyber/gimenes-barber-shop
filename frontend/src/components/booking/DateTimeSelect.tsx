import { useState, useEffect } from 'react'
import { Barber, TimeSlot as TimeSlotType } from '../../types'
import { Calendar } from '../ui/Calendar'
import { TimeSlot } from '../ui/TimeSlot'
import { Loading } from '../ui/Loading'
import { Button } from '../ui/Button'
import { format } from 'date-fns'

interface DateTimeSelectProps {
  selectedBarber: Barber | null
  selectedDate: string
  selectedTime: string
  timeSlots: TimeSlotType[]
  loading: boolean
  onLoadAvailability: (barberId: number | 'any', date: Date) => void
  onSelectDateTime: (date: string, time: string) => void
}

export function DateTimeSelect({
  selectedBarber,
  selectedDate,
  selectedTime,
  timeSlots,
  loading,
  onLoadAvailability,
  onSelectDateTime
}: DateTimeSelectProps) {
  const [date, setDate] = useState<Date | null>(
    selectedDate ? new Date(selectedDate + 'T12:00:00') : null
  )
  const [time, setTime] = useState(selectedTime)

  useEffect(() => {
    if (date) {
      const barberId = selectedBarber?.id || 'any'
      onLoadAvailability(barberId, date)
    }
  }, [date, selectedBarber, onLoadAvailability])

  const handleDateSelect = (selectedDate: Date) => {
    setDate(selectedDate)
    setTime('')
  }

  const handleTimeSelect = (selectedTime: string) => {
    setTime(selectedTime)
  }

  const handleContinue = () => {
    if (date && time) {
      onSelectDateTime(format(date, 'yyyy-MM-dd'), time)
    }
  }

  const availableSlots = timeSlots.filter(slot => slot.available)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-dark-300 mb-3">
          Selecione a data
        </h3>
        <Calendar
          selectedDate={date}
          onSelectDate={handleDateSelect}
        />
      </div>

      {date && (
        <div>
          <h3 className="text-sm font-medium text-dark-300 mb-3">
            Horarios disponiveis
          </h3>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <Loading text="Carregando horarios..." />
            </div>
          ) : availableSlots.length > 0 ? (
            <div className="grid grid-cols-4 gap-2">
              {availableSlots.map((slot) => (
                <TimeSlot
                  key={slot.time}
                  time={slot.time}
                  available={slot.available}
                  selected={time === slot.time}
                  onSelect={() => handleTimeSelect(slot.time)}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-dark-400 py-8">
              Nenhum horario disponivel nesta data
            </p>
          )}
        </div>
      )}

      {date && time && (
        <Button fullWidth onClick={handleContinue}>
          Continuar
        </Button>
      )}
    </div>
  )
}
