import { ArrowRight } from 'lucide-react'

type SecondaryButtonProps = {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
}

export function SecondaryButton({
  children,
  onClick,
  type = 'button',
  disabled = false,
}: SecondaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-2 rounded-card border border-border bg-surface px-6 py-3 text-sm font-semibold text-stone-700 shadow-card transition-colors hover:border-stone-300 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </button>
  )
}
