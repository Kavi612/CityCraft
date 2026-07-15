import { motion } from 'framer-motion'

const orbs = [
  { size: 280, x: '8%', y: '12%', color: 'rgba(217,119,6,0.18)', duration: 14, delay: 0 },
  { size: 220, x: '78%', y: '8%', color: 'rgba(139,92,246,0.22)', duration: 18, delay: 1 },
  { size: 320, x: '62%', y: '58%', color: 'rgba(59,130,246,0.14)', duration: 16, delay: 0.5 },
  { size: 180, x: '18%', y: '68%', color: 'rgba(236,72,153,0.12)', duration: 20, delay: 2 },
  { size: 140, x: '44%', y: '38%', color: 'rgba(251,191,36,0.1)', duration: 12, delay: 1.5 },
] as const

const particles = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  left: `${(index * 17 + 5) % 95}%`,
  top: `${(index * 23 + 8) % 88}%`,
  size: 4 + (index % 3) * 2,
  duration: 10 + (index % 5) * 2,
  delay: index * 0.35,
}))

export function FloatingBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(88,28,135,0.35),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(30,58,138,0.25),transparent_50%)]" />

      {orbs.map((orb, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full blur-3xl"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: orb.color,
          }}
          animate={{
            x: [0, 24, -16, 0],
            y: [0, -20, 14, 0],
            scale: [1, 1.08, 0.95, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: orb.delay,
          }}
        />
      ))}

      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full bg-white/20"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.15, 0.55, 0.15],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  )
}
