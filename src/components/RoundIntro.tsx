import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface RoundIntroProps {
  roundNumber: number
  roundTitle: string
  questionCount: number
  onStart: () => void
}

// Official Olympic ring colors
const RING_COLORS = ['#0085C7', '#F4C300', '#000000', '#009F6B', '#DF0024']

export default function RoundIntro({ roundNumber, roundTitle, questionCount, onStart }: RoundIntroProps) {
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    setCountdown(3)
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval)
          onStart()
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [roundNumber]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      {/* Brand gradient bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6 }}
        className="w-64 h-1 brand-gradient rounded-full"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="font-bebas text-teal text-4xl tracking-widest mb-2">
          ROUND {roundNumber}
        </div>
        <div className="font-bebas text-white text-6xl tracking-wide leading-none mb-4">
          {roundTitle}
        </div>
        <div className="text-white/60 text-xl">{questionCount} Questions</div>
      </motion.div>

      {/* Olympic rings — official 5-color SVG */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <OlympicRings size={56} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="font-bebas text-white/50 text-2xl tracking-widest">
          AUTO-START IN {countdown}...
        </div>
        <button
          onClick={onStart}
          className="brand-gradient text-white font-bebas text-2xl px-10 py-3 rounded-xl shadow-lg hover:opacity-90 transition-opacity"
        >
          START ROUND NOW
        </button>
      </motion.div>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-64 h-1 brand-gradient rounded-full"
      />
    </div>
  )
}

// Proper Olympic rings SVG component
export function OlympicRings({ size = 48 }: { size?: number }) {
  const r = size * 0.45
  const stroke = size * 0.1
  const gap = size * 0.82
  const topY = size * 0.5
  const botY = size * 0.85
  const totalWidth = gap * 4 + r * 2

  // Positions: 3 top (1,3,5), 2 bottom (2,4)
  const cx = [
    r,
    r + gap,
    r + gap * 2,
    r + gap * 3,
    r + gap * 4,
  ]
  const cy = [topY, botY, topY, botY, topY]

  return (
    <svg
      viewBox={`0 0 ${totalWidth} ${botY + r}`}
      width={totalWidth}
      height={botY + r}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Back half of even-index rings (rendered first, behind odd) */}
      {[1, 3].map((i) => (
        <circle
          key={`back-${i}`}
          cx={cx[i]}
          cy={cy[i]}
          r={r}
          fill="none"
          stroke={RING_COLORS[i]}
          strokeWidth={stroke}
        />
      ))}
      {/* Front odd-index rings */}
      {[0, 2, 4].map((i) => (
        <circle
          key={`front-${i}`}
          cx={cx[i]}
          cy={cy[i]}
          r={r}
          fill="none"
          stroke={RING_COLORS[i]}
          strokeWidth={stroke}
        />
      ))}
    </svg>
  )
}
