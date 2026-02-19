import { SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string | number; label: string }[]
}

export function Select({
  label,
  error,
  options,
  className = '',
  ...props
}: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-dark-200 mb-2">
          {label}
        </label>
      )}
      <select
        className={`w-full bg-dark-800 border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 transition-all appearance-none cursor-pointer ${
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
            : 'border-dark-600 focus:border-primary-500 focus:ring-primary-500'
        } ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}



