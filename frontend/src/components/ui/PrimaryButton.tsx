import { ArrowRight } from 'lucide-react'

type PrimaryButtonProps = {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
}

export function PrimaryButton({
  children,
  onClick,
  type = 'button',
  disabled = false,
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-2 rounded-card bg-primary px-6 py-3 text-sm font-semibold text-white shadow-card transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </button>
  )
}
