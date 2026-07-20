import { motion } from 'framer-motion'
import {
  ArrowRight,
  Building2,
  ChevronRight,
  Target,
  TrendingUp,
  UserRound,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

const steps = [
  {
    number: 1,
    title: 'Choose Founder',
    description: 'Pick your founder and define your startup identity.',
    icon: UserRound,
    accent: 'bg-sky-100 text-sky-700',
  },
  {
    number: 2,
    title: 'Choose City',
    description: 'Select a city with unique challenges and opportunities.',
    icon: Building2,
    accent: 'bg-indigo-100 text-indigo-700',
  },
  {
    number: 3,
    title: 'Solve Problems',
    description: 'Identify real problems and build solutions that matter.',
    icon: Target,
    accent: 'bg-rose-100 text-rose-700',
  },
  {
    number: 4,
    title: 'Grow Startup',
    description: 'Earn trust, get investment and scale your startup.',
    icon: TrendingUp,
    accent: 'bg-amber-100 text-amber-700',
  },
] as const

function CityCraftLogo() {
  return (
    <div className="flex flex-col items-center gap-1">
      <img
        src="/assets/logo.png"
        alt="City Craft"
        className="h-28 w-auto object-contain sm:h-36 lg:h-40"
      />
      <p className="text-xs font-bold tracking-[0.18em] text-navy sm:text-sm">
        Build • Solve • Innovate • Grow
      </p>
    </div>
  )
}

function SectionHeading() {
  return (
    <div className="flex items-center justify-center gap-2">
      <span className="h-px w-8 bg-linear-to-r from-transparent to-primary sm:w-12" />
      <ChevronRight className="h-4 w-4 text-primary" aria-hidden="true" />
      <h2 className="font-display text-sm font-extrabold tracking-[0.12em] text-[#0E1628] sm:text-base">
        HOW IT WORKS
      </h2>
      <ChevronRight
        className="h-4 w-4 rotate-180 text-primary"
        aria-hidden="true"
      />
      <span className="h-px w-8 bg-linear-to-l from-transparent to-primary sm:w-12" />
    </div>
  )
}

function HowItWorksSteps() {
  return (
    <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:items-stretch sm:justify-center sm:gap-2">
      {steps.map((step, index) => {
        const Icon = step.icon

        return (
          <div key={step.title} className="flex items-center gap-1 sm:gap-1.5">
            <article className="relative w-full rounded-xl border border-border bg-surface px-2 pb-2 pt-4 shadow-card sm:w-34 sm:rounded-2xl sm:px-2 sm:pb-3 sm:pt-5 lg:w-40">
              <span className="absolute -top-2.5 left-1/2 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full bg-linear-to-br from-primary to-amber-400 text-[10px] font-bold text-white shadow-card sm:h-6 sm:w-6 sm:text-xs">
                {step.number}
              </span>

              <div className="flex flex-col items-center text-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg sm:h-11 sm:w-11 sm:rounded-xl ${step.accent}`}
                >
                  <Icon
                    className="h-4 w-4 sm:h-5 sm:w-5"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </div>
                <h3 className="mt-1.5 text-[10px] font-extrabold leading-tight text-[#0E1628] sm:mt-2 sm:text-xs lg:text-sm">
                  {step.title}
                </h3>
                <p className="mt-0.5 line-clamp-2 text-[10px] font-medium leading-snug text-navy sm:line-clamp-3 lg:text-[11px]">
                  {step.description}
                </p>
              </div>
            </article>

            {index < steps.length - 1 && (
              <ChevronRight
                className="hidden h-3.5 w-3.5 shrink-0 text-primary sm:block sm:h-4 sm:w-4"
                aria-hidden="true"
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-svh flex-col overflow-y-auto bg-background font-sans">
      {/* Hero — top portion */}
      <section className="relative min-h-0 flex-[1.15] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/assets/cities/hero_bg.png')" }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-linear-to-b from-white/15 via-white/30 to-background"
          aria-hidden="true"
        />

        <motion.div
          className="relative flex h-full flex-col items-center justify-center px-4 py-4 text-center sm:px-6"
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, ease: 'easeOut' }}
          variants={fadeUp}
        >
          <CityCraftLogo />

          <h1 className="mt-3 max-w-2xl text-xl font-extrabold leading-tight text-[#0E1628] sm:mt-4 sm:text-2xl lg:text-3xl">
            Build a Startup That Changes the City
          </h1>
          <p className="mt-2 max-w-xl text-xs font-semibold leading-snug text-navy sm:text-sm">
            Choose your path. Solve real city problems. Earn trust. Raise
            investment. Grow your startup.
          </p>

          <button
            type="button"
            onClick={() => navigate('/founder')}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-primary via-amber-500 to-amber-400 px-5 py-2.5 text-xs font-bold text-white shadow-[0_6px_20px_rgba(217,119,6,0.35)] transition-transform hover:scale-[1.02] sm:mt-5 sm:px-7 sm:py-3 sm:text-sm"
          >
            Start Your Startup Journey
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </motion.div>
      </section>

      {/* How it works — bottom panel, no scroll */}
      <motion.section
        className="shrink-0 rounded-t-[1.75rem] bg-background px-3 pb-4 pt-3 shadow-[0_-8px_30px_rgba(26,43,72,0.06)] sm:rounded-t-4xl sm:px-6 sm:pb-5 sm:pt-4"
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
        variants={fadeUp}
      >
        <div className="mx-auto max-w-6xl">
          <SectionHeading />
          <HowItWorksSteps />
        </div>
      </motion.section>
    </div>
  )
}
