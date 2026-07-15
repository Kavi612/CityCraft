import { PrimaryButton } from '@/components/ui/PrimaryButton'
import { SecondaryButton } from '@/components/ui/SecondaryButton'
import { SelectionCard } from '@/components/ui/SelectionCard'
import { StepIndicator } from '@/components/ui/StepIndicator'
import { StatCard } from '@/components/ui/StatCard'

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-card border border-border bg-surface p-8 shadow-card">
      <h2 className="mb-6 text-lg font-semibold text-stone-800">{title}</h2>
      {children}
    </section>
  )
}

export default function StyleGuide() {
  return (
    <div className="min-h-svh bg-background px-6 py-12">
      <div className="mx-auto max-w-3xl space-y-10">
        <header>
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Dev only
          </p>
          <h1 className="mt-2 text-3xl font-bold text-stone-800">
            City Craft — Style Guide
          </h1>
          <p className="mt-2 text-stone-500">
            Visual QA checkpoint. Approve colors and components here before any
            real screens are built.
          </p>
        </header>

        <Section title="Color palette">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="h-16 rounded-card border border-border bg-background" />
              <p className="mt-2 text-sm font-medium text-stone-700">
                background
              </p>
              <p className="text-xs text-stone-400">#FBF7F0</p>
            </div>
            <div>
              <div className="h-16 rounded-card bg-primary" />
              <p className="mt-2 text-sm font-medium text-stone-700">
                primary
              </p>
              <p className="text-xs text-stone-400">#D97706</p>
            </div>
            <div>
              <div className="h-16 rounded-card bg-secondary" />
              <p className="mt-2 text-sm font-medium text-stone-700">
                secondary
              </p>
              <p className="text-xs text-stone-400">#5B8A72</p>
            </div>
          </div>
        </Section>

        <Section title="Buttons">
          <div className="flex flex-wrap gap-4">
            <PrimaryButton>Start Your Startup</PrimaryButton>
            <SecondaryButton>Learn More</SecondaryButton>
          </div>
        </Section>

        <Section title="Selection cards">
          <div className="grid gap-4 sm:grid-cols-3">
            <SelectionCard
              title="Unselected"
              description="Default card state with soft shadow."
            />
            <SelectionCard
              title="Selected"
              description="Orange ring, no checkmark."
              selected
            />
            <SelectionCard
              title="Selected + check"
              description="Ring plus checkmark badge."
              selected
              showCheckmark
            />
          </div>
        </Section>

        <Section title="Step indicator">
          <div className="space-y-6">
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-stone-400">
                Step 2 of 4 (active)
              </p>
              <StepIndicator steps={4} currentStep={2} />
            </div>
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-stone-400">
                Step 4 of 4 (complete)
              </p>
              <StepIndicator steps={4} currentStep={5} />
            </div>
          </div>
        </Section>

        <Section title="Stat cards">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Cash" value="₹2,50,000" trend="up" />
            <StatCard label="Customers" value="128" />
            <StatCard label="Reputation" value="72" trend="down" />
          </div>
        </Section>
      </div>
    </div>
  )
}
