import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'

interface TimerProps {
  duration: number
  timerEnd: number | null
  timerActive: boolean
  onStop: () => void
}

export default function Timer({ duration, timerEnd, timerActive, onStop }: TimerProps) {
  const [remaining, setRemaining] = useState(duration)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!timerActive || timerEnd === null) {
      setRemaining(duration)
      return
    }

    const tick = () => {
      const now = Date.now()
      const rem = Math.max(0, Math.ceil((timerEnd - now) / 1000))
      setRemaining(rem)
      if (rem > 0) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        onStop()
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [timerActive, timerEnd, duration, onStop])

  const radius = 24
  const circumference = 2 * Math.PI * radius
  const progress = remaining / duration
  const isRed = remaining <= 10 && timerActive

  return (
    <div className="flex items-center gap-1">
      <svg width="60" height="60" className="rotate-[-90deg]">
        <circle
          cx="30"
          cy="30"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="4"
        />
        <motion.circle
          cx="30"
          cy="30"
          r={radius}
          fill="none"
          stroke={isRed ? '#EF4444' : '#5B9BD5'}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          animate={{ strokeDashoffset: circumference * (1 - progress) }}
          transition={{ duration: 0.1 }}
        />
      </svg>
      <span
        className={`font-bebas text-3xl w-8 text-center transition-colors ${isRed ? 'text-red-400' : 'text-white'}`}
      >
        {remaining}
      </span>
    </div>
  )
}
