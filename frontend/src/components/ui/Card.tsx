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
  const baseStyles = 'bg-dark-800 border rounded-xl p-6 transition-all duration-200'
  const hoverStyles = hoverable ? 'cursor-pointer hover:border-primary-500/50 hover:bg-dark-750' : ''
  const selectedStyles = selected ? 'border-primary-500 bg-dark-700' : 'border-dark-700'

  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${selectedStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
