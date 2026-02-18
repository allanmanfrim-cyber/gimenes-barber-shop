interface TimeSlotProps {
  time: string
  available: boolean
  selected: boolean
  onSelect: () => void
}

export function TimeSlot({ time, available, selected, onSelect }: TimeSlotProps) {
  if (!available) return null

  return (
    <button
      onClick={onSelect}
      className={`
        py-3 px-4 rounded-lg font-medium text-sm transition-all
        ${selected
          ? 'bg-primary-500 text-dark-900'
          : 'bg-dark-700 text-white hover:bg-dark-600 border border-dark-600'
        }
      `}
    >
      {time}
    </button>
  )
}
