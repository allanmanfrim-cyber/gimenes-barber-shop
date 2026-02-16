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
    <div className="bg-white rounded-xl p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-dark-500" />
        </button>
        <h3 className="font-semibold text-dark-900 capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
        </h3>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-dark-500" />
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
                ${!currentMonthDay ? 'text-gray-300' : ''}
                ${disabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'}
                ${selected ? 'bg-green-700 text-white hover:bg-green-800' : ''}
                ${today && !selected ? 'border border-green-700 text-green-700' : ''}
                ${!disabled && !selected && !today ? 'text-dark-900' : ''}
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
