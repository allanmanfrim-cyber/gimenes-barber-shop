import { useState, useEffect } from 'react'
import { Barber, TimeSlot as TimeSlotType } from '../../types'
import { Calendar } from '../ui/Calendar'
import { TimeSlot } from '../ui/TimeSlot'

import { Button } from '../ui/Button'
import { format } from 'date-fns'
import { CalendarDays, Clock } from 'lucide-react'

interface DateTimeSelectProps {
  selectedBarber: Barber | null
  selectedDate: string
  selectedTime: string
  timeSlots: TimeSlotType[]
  loading: boolean
  onLoadAvailability: (barberId: string | 'any', date: Date) => void
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

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div>
        <div className="flex items-center gap-2 mb-6 px-2">
          <CalendarDays className="w-3.5 h-3.5 text-primary-500" />
          <span className="text-[10px] text-primary-500 font-black uppercase tracking-[0.3em]">Selecione a Data</span>
        </div>
        <Calendar
          selectedDate={date}
          onSelectDate={handleDateSelect}
        />
      </div>

      {date && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="flex items-center gap-2 mb-6 px-2 border-t border-white/[0.03] pt-10">
            <Clock className="w-3.5 h-3.5 text-primary-500" />
            <span className="text-[10px] text-primary-500 font-black uppercase tracking-[0.3em]">Horários Disponíveis</span>
          </div>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-neutral-900/20 rounded-3xl border border-white/[0.03]">
               <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
               <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">Verificando Agenda...</p>
            </div>
          ) : timeSlots.length > 0 ? (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {timeSlots.map((slot) => (
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
            <div className="text-center py-20 bg-neutral-900/20 border border-white/[0.03] rounded-3xl">
               <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.2em]">
                Indisponível para esta data
              </p>
            </div>
          )}
        </div>
      )}

      {date && time && (
        <div className="fixed bottom-6 left-6 right-6 max-w-lg mx-auto md:relative md:bottom-0 md:left-0 md:right-0 animate-in slide-in-from-bottom-10 duration-500">
           <Button fullWidth onClick={handleContinue} className="h-16 rounded-full bg-primary-500 text-black border-none font-black uppercase tracking-[0.2em] text-xs shadow-[0_10px_30px_rgba(197,160,89,0.3)] hover:scale-105 transition-all">
            Confirmar Horário
          </Button>
        </div>
      )}
    </div>
  )
}





