import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-dark-200 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full bg-dark-800 border rounded-lg px-4 py-3 text-white placeholder-dark-400 focus:outline-none focus:ring-1 transition-all ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-dark-600 focus:border-primary-500 focus:ring-primary-500'
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
