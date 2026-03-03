import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface RoundIntroProps {
  roundNumber: number
  roundTitle: string
  questionCount: number
  onStart: () => void
}

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
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="font-bebas text-ice-blue text-4xl tracking-widest mb-2">
          ROUND {roundNumber}
        </div>
        <div className="font-bebas text-white text-6xl tracking-wide leading-none mb-4">
          {roundTitle}
        </div>
        <div className="text-white/60 text-xl">{questionCount} Questions</div>
      </motion.div>

      {/* Decorative ring */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex gap-4"
      >
        {['#1A3A5C', '#5B9BD5', '#C9A84C', '#CBD5E1', '#5B9BD5'].map((color, i) => (
          <div
            key={i}
            className="w-10 h-10 rounded-full border-4"
            style={{ borderColor: color }}
          />
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="font-bebas text-white/60 text-2xl tracking-widest">
          AUTO-START IN {countdown}...
        </div>
        <button
          onClick={onStart}
          className="bg-gold hover:bg-yellow-400 text-navy font-bebas text-2xl px-10 py-3 rounded-xl transition-colors shadow-lg"
        >
          START ROUND NOW
        </button>
      </motion.div>
    </div>
  )
}
