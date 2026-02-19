interface BookingStepperProps {
  currentStep: number
  totalSteps: number
}

export function BookingStepper({ currentStep, totalSteps }: BookingStepperProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1
        const isActive = stepNumber === currentStep
        const isCompleted = stepNumber < currentStep

        return (
          <div key={stepNumber} className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full transition-all ${
                isActive
                  ? 'bg-primary-500 w-4'
                  : isCompleted
                  ? 'bg-primary-500'
                  : 'bg-dark-600'
              }`}
            />
          </div>
        )
      })}
    </div>
  )
}



