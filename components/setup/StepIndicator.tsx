interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  stepTitles: string[]
}

export function StepIndicator({ currentStep, totalSteps, stepTitles }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  step < currentStep
                    ? 'bg-green-600 text-white'
                    : step === currentStep
                    ? 'bg-green-600 text-white ring-4 ring-green-200'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step < currentStep ? '✓' : step}
              </div>
              <span
                className={`mt-2 text-xs text-center ${
                  step === currentStep ? 'text-green-600 font-semibold' : 'text-gray-500'
                }`}
              >
                {stepTitles[step - 1]}
              </span>
            </div>
            {step < totalSteps && (
              <div
                className={`flex-1 h-1 mx-2 transition-colors ${
                  step < currentStep ? 'bg-green-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
