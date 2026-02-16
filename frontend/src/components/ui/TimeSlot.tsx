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
          ? 'bg-green-700 text-white'
          : 'bg-white text-dark-900 hover:bg-gray-100 border border-gray-200'
        }
      `}
    >
      {time}
    </button>
  )
}
