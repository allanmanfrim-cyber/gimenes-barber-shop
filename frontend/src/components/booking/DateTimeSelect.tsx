import { useState, useEffect } from 'react'
import { Barber, Service, TimeSlot as TimeSlotType } from '../../types'
import { Loading } from '../ui/Loading'
import { Calendar as CalendarIcon, Clock } from 'lucide-react'
import { format, addDays, isToday } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface DateTimeSelectProps {
  selectedBarber: Barber | null
  selectedServices: Service[]
  selectedDate: string
  selectedTime: string
  timeSlots: TimeSlotType[]
  loading: boolean
  onLoadAvailability: (barberId: number | 'any', date: Date) => void
  onSelectDate: (date: string) => void
  onSelectTime: (time: string) => void
}

export function DateTimeSelect({
  selectedBarber,
  selectedServices,
  selectedDate,
  selectedTime,
  timeSlots,
  loading,
  onLoadAvailability,
  onSelectDate,
  onSelectTime
}: DateTimeSelectProps) {
  const [selectedDateObj, setSelectedDateObj] = useState<Date | null>(
    selectedDate ? new Date(selectedDate + 'T12:00:00') : null
  )

  const days = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i))

  useEffect(() => {
    if (selectedDateObj && selectedServices.length > 0) {
      const barberId = selectedBarber?.id || 'any'
      onLoadAvailability(barberId, selectedDateObj)
      onSelectDate(format(selectedDateObj, 'yyyy-MM-dd'))
    }
  }, [selectedDateObj, selectedBarber])

  const handleDateSelect = (date: Date) => {
    setSelectedDateObj(date)
    onSelectTime('')
  }

  const handleTimeSelect = (time: string) => {
    onSelectTime(time)
  }

  const isDateSelected = (date: Date) => {
    if (!selectedDateObj) return false
    return format(date, 'yyyy-MM-dd') === format(selectedDateObj, 'yyyy-MM-dd')
  }

  return (
    <div className="px-4 py-6">
      <p className="text-dark-400 text-sm mb-6">Selecione o dia e o melhor horário para você</p>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <CalendarIcon className="w-5 h-5 text-dark-600" />
          <h3 className="text-lg font-bold text-dark-900">Selecione o dia</h3>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {days.map((date) => {
            const selected = isDateSelected(date)
            const today = isToday(date)
            const isSunday = date.getDay() === 0
            
            return (
              <button
                key={date.toISOString()}
                onClick={() => !isSunday && handleDateSelect(date)}
                disabled={isSunday}
                className={`p-3 rounded-xl border-2 transition-all text-center ${
                  selected
                    ? 'border-primary-500 bg-primary-50'
                    : isSunday
                      ? 'bg-gray-50 border-gray-100 opacity-50 cursor-not-allowed'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="text-xs text-dark-400 mb-1">
                  {format(date, 'EEEE', { locale: ptBR })}
                </div>
                <div className={`text-2xl font-bold ${
                  selected ? 'text-primary-600' : isSunday ? 'text-gray-300' : 'text-dark-900'
                }`}>
                  {format(date, 'd')}
                </div>
                <div className="text-xs text-dark-400">
                  {format(date, 'MMM', { locale: ptBR })}
                </div>
                {today && (
                  <div className="text-xs text-primary-600 font-medium">Hoje</div>
                )}
                {isSunday && (
                  <div className="text-[10px] text-gray-400 font-medium uppercase mt-1">Fechado</div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {selectedDateObj && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-dark-600" />
            <h3 className="text-lg font-bold text-dark-900">Selecione o horário</h3>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <Loading text="Carregando horários..." />
            </div>
          ) : timeSlots.length > 0 ? (
            <>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {timeSlots.map((slot) => {
                  const selected = selectedTime === slot.time
                  const isLunch = slot.time === '14:30'
                  const available = slot.available && !isLunch
                  
                  return (
                    <button
                      key={slot.time}
                      onClick={() => available && handleTimeSelect(slot.time)}
                      disabled={!available}
                      className={`py-3 px-4 rounded-xl text-sm font-medium transition-all border-2 ${
                        selected
                          ? 'bg-dark-900 text-white border-dark-900'
                          : available
                            ? 'bg-white text-dark-900 border-gray-200 hover:border-gray-300'
                            : 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed'
                      }`}
                    >
                      {slot.time}
                    </button>
                  )
                })}
              </div>

              <div className="flex items-center justify-center gap-6 text-xs text-dark-400">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border-2 border-gray-200 bg-white" />
                  <span>Disponível</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border-2 border-green-700 bg-white" />
                  <span>Selecionado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gray-200" />
                  <span>Indisponível</span>
                </div>
              </div>
            </>
          ) : (
            <p className="text-center text-dark-400 py-8">
              Nenhum horário disponível nesta data
            </p>
          )}
        </div>
      )}

      {selectedDateObj && selectedTime && (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <h4 className="text-lg font-bold text-dark-900 mb-3">Horário selecionado</h4>
          <div className="flex items-center gap-4 text-dark-600">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              <span className="text-sm">
                {format(selectedDateObj, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-dark-400">•</span>
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium text-primary-600">{selectedTime}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
