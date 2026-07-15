type StepIndicatorProps = {
  steps: number
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center">
      {Array.from({ length: steps }, (_, index) => {
        const stepNumber = index + 1
        const isComplete = stepNumber < currentStep
        const isActive = stepNumber === currentStep
        const isFilled = isComplete || isActive

        return (
          <div key={stepNumber} className="flex items-center">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                isFilled
                  ? 'bg-primary text-white'
                  : 'border-2 border-stone-300 bg-surface text-stone-400'
              }`}
            >
              {stepNumber}
            </div>
            {stepNumber < steps && (
              <div
                className={`mx-2 h-0.5 w-12 sm:w-16 ${
                  isComplete ? 'bg-primary' : 'bg-stone-300'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
