import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full group">
        {label && (
          <label className="block text-[10px] font-black text-primary-500/80 uppercase tracking-[0.2em] mb-2.5 ml-1 transition-colors group-focus-within:text-primary-500">
            {label}
          </label>
        )}
        <div className="relative">
           <input
            ref={ref}
            className={`w-full bg-neutral-900 border rounded-2xl px-5 py-4 text-white placeholder-neutral-600 focus:outline-none transition-all duration-300 font-medium ${
              error
                ? 'border-red-500/50 focus:border-red-500 focus:bg-red-500/5'
                : 'border-white/[0.05] focus:border-primary-500/50 focus:bg-neutral-800/30 shadow-[0_0_0_0_rgba(197,160,89,0)] focus:shadow-[0_0_20px_rgba(197,160,89,0.05)]'
            } ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-2 ml-1 text-[10px] font-bold text-red-500 uppercase tracking-wider animate-in fade-in slide-in-from-top-1">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
