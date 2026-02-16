interface BookingStepperProps {
  currentStep: number
  totalSteps: number
  stepTitle?: string
}

export function BookingStepper({ currentStep, totalSteps, stepTitle }: BookingStepperProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="bg-white px-4 py-3 border-b border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-dark-500">Passo {currentStep} de {totalSteps}</span>
        {stepTitle && (
          <span className="text-sm text-dark-400">{stepTitle}</span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div 
          className="bg-green-700 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
