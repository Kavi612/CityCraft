import { Check } from 'lucide-react'

type SelectionCardProps = {
  title: string
  description?: string
  imageSrc?: string
  imageAlt?: string
  selected?: boolean
  showCheckmark?: boolean
  onSelect?: () => void
}

export function SelectionCard({
  title,
  description,
  imageSrc,
  imageAlt,
  selected = false,
  showCheckmark = true,
  onSelect,
}: SelectionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative w-full rounded-card bg-surface p-5 text-left shadow-card transition-all ${
        selected
          ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
          : 'border border-border hover:shadow-card-hover'
      }`}
    >
      {selected && showCheckmark && (
        <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
          <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
        </span>
      )}

      {imageSrc && (
        <div className="mb-4 flex justify-center">
          <img
            src={imageSrc}
            alt={imageAlt ?? title}
            className="aspect-square h-20 w-20 rounded-full border border-border object-cover"
          />
        </div>
      )}

      <p className={`text-base font-semibold text-stone-800 ${showCheckmark ? 'pr-8' : ''}`}>
        {title}
      </p>
      {description && (
        <p className="mt-1 text-sm text-stone-500">{description}</p>
      )}
    </button>
  )
}
