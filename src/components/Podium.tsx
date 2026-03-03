import { useEffect } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Team } from '../types'

interface PodiumProps {
  teams: Team[]
  onRestart: () => void
}

export default function Podium({ teams, onRestart }: PodiumProps) {
  const sorted = [...teams].sort((a, b) => b.score - a.score).slice(0, 3)

  useEffect(() => {
    // Big confetti burst
    const end = Date.now() + 4000
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#1A3A5C', '#5B9BD5', '#C9A84C', '#ffffff'],
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#1A3A5C', '#5B9BD5', '#C9A84C', '#ffffff'],
      })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()
  }, [])

  const podiumOrder = [
    { rank: 1, team: sorted[0], height: 180, color: '#C9A84C', medal: '🥇', delay: 0.4 },
    { rank: 2, team: sorted[1], height: 130, color: '#CBD5E1', medal: '🥈', delay: 0.2 },
    { rank: 3, team: sorted[2], height: 90, color: '#CD7F32', medal: '🥉', delay: 0.0 },
  ]

  // Reorder: 2nd, 1st, 3rd
  const displayOrder = [podiumOrder[1], podiumOrder[0], podiumOrder[2]]

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-bebas text-gold text-7xl tracking-widest"
      >
        FINAL RESULTS
      </motion.h1>

      <div className="flex items-end justify-center gap-4">
        {displayOrder.map(({ rank, team, height, color, medal, delay }) => (
          <motion.div
            key={rank}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.6, type: 'spring' }}
            className="flex flex-col items-center"
          >
            {team && (
              <div className="mb-3 text-center">
                <div className="text-4xl">{medal}</div>
                <div className="font-bebas text-2xl text-white">{team.name}</div>
                <div className="font-bebas text-3xl text-gold">{team.score} pts</div>
              </div>
            )}
            <div
              className="w-40 flex items-center justify-center rounded-t-lg"
              style={{ height: `${height}px`, backgroundColor: color }}
            >
              <span className="font-bebas text-5xl text-white drop-shadow">{rank}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {teams.length === 0 && (
        <p className="text-white/60 text-xl">No teams were registered for this game.</p>
      )}

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        onClick={onRestart}
        className="bg-ice-blue hover:bg-blue-400 text-white font-bebas text-2xl px-12 py-3 rounded-xl transition-colors shadow-lg mt-4"
      >
        PLAY AGAIN
      </motion.button>
    </div>
  )
}
