import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  selected?: boolean
  hoverable?: boolean
}

export function Card({
  children,
  className = '',
  onClick,
  selected = false,
  hoverable = false
}: CardProps) {
  const baseStyles = 'bg-neutral-900/40 border border-white/[0.03] rounded-2xl p-6 transition-all duration-300'
  const hoverStyles = hoverable ? 'cursor-pointer hover:border-primary-500/20 hover:bg-neutral-900/60 active:scale-[0.98]' : ''
  const selectedStyles = selected ? 'border-primary-500/50 bg-neutral-900/80 shadow-[0_0_20px_rgba(197,160,89,0.05)]' : ''

  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${selectedStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}



