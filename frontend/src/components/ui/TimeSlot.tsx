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
        py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300
        ${selected
          ? 'bg-primary-500 text-black shadow-[0_0_15px_rgba(197,160,89,0.2)] scale-[1.05] z-10'
          : 'bg-neutral-900 border border-white/[0.05] text-neutral-400 hover:border-primary-500/30 hover:text-white'
        }
      `}
    >
      {time}
    </button>
  )
}
