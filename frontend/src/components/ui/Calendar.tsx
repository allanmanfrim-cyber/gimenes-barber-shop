import { useState } from 'react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, isBefore, startOfDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CalendarProps {
  selectedDate: Date | null
  onSelectDate: (date: Date) => void
  minDate?: Date
}

export function Calendar({ selectedDate, onSelectDate, minDate = new Date() }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const startDay = monthStart.getDay()
  const emptyDays = Array(startDay).fill(null)

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  const isDateDisabled = (date: Date) => {
    return isBefore(startOfDay(date), startOfDay(minDate))
  }

  return (
    <div className="bg-dark-800 rounded-xl p-4 border border-dark-700">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-dark-300" />
        </button>
        <h3 className="font-semibold text-white capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
        </h3>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-dark-300" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-dark-400 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}
        {days.map((day) => {
          const disabled = isDateDisabled(day)
          const selected = selectedDate && isSameDay(day, selectedDate)
          const today = isToday(day)
          const currentMonthDay = isSameMonth(day, currentMonth)

          return (
            <button
              key={day.toISOString()}
              onClick={() => !disabled && onSelectDate(day)}
              disabled={disabled}
              className={`
                aspect-square rounded-lg text-sm font-medium transition-all
                ${!currentMonthDay ? 'text-dark-600' : ''}
                ${disabled ? 'text-dark-600 cursor-not-allowed' : 'hover:bg-dark-700 cursor-pointer'}
                ${selected ? 'bg-primary-500 text-dark-900 hover:bg-primary-600' : ''}
                ${today && !selected ? 'border border-primary-500 text-primary-500' : ''}
                ${!disabled && !selected && !today ? 'text-white' : ''}
              `}
            >
              {format(day, 'd')}
            </button>
          )
        })}
      </div>
    </div>
  )
}
