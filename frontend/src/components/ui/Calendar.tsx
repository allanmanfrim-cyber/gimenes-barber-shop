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
  const days = Array.from(eachDayOfInterval({ start: monthStart, end: monthEnd }))

  const startDay = monthStart.getDay()
  const emptyDays = Array(startDay).fill(null)

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  const isDateDisabled = (date: Date) => {
    return isBefore(startOfDay(date), startOfDay(minDate))
  }

  return (
    <div className="bg-neutral-900/40 rounded-3xl p-6 border border-white/[0.03] backdrop-blur-sm animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8 px-2">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="w-10 h-10 flex items-center justify-center bg-neutral-900 border border-white/[0.05] rounded-full hover:border-primary-500/50 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-primary-500" />
        </button>
        <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] pt-1">
          {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
        </h3>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="w-10 h-10 flex items-center justify-center bg-neutral-900 border border-white/[0.05] rounded-full hover:border-primary-500/50 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-primary-500" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-[10px] font-black text-neutral-600 uppercase tracking-widest py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}
        {days.map((day) => {
          const disabled = isDateDisabled(day)
          const selected = selectedDate && isSameDay(day, selectedDate)
          const today = isToday(day)
          const isCurrentMonth = isSameMonth(day, currentMonth)

          return (
            <button
              key={day.toISOString()}
              onClick={() => !disabled && onSelectDate(day)}
              disabled={disabled}
              className={`
                aspect-square rounded-xl text-xs font-bold transition-all flex items-center justify-center relative
                ${!isCurrentMonth ? 'opacity-20' : ''}
                ${disabled ? 'text-neutral-700 cursor-not-allowed' : 'hover:bg-primary-500/10 cursor-pointer'}
                ${selected ? 'bg-primary-500 !text-black shadow-[0_0_15px_rgba(197,160,89,0.3)] !opacity-100' : ''}
                ${today && !selected ? 'border border-primary-500/30 text-primary-500' : ''}
                ${!disabled && !selected && !today ? 'text-white/80' : ''}
              `}
            >
              {format(day, 'd')}
              {today && !selected && (
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-500 rounded-full" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}



