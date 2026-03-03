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
    const end = Date.now() + 4000
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#00C4CC', '#6B3CC8', '#E0197D', '#ffffff'],
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#00C4CC', '#6B3CC8', '#E0197D', '#ffffff'],
      })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()
  }, [])

  const podiumOrder = [
    { rank: 1, team: sorted[0], height: 180, bg: 'brand-gradient', medal: '🥇', delay: 0.4 },
    { rank: 2, team: sorted[1], height: 130, bg: '#1A3A6C',         medal: '🥈', delay: 0.2 },
    { rank: 3, team: sorted[2], height: 90,  bg: '#0D2240',         medal: '🥉', delay: 0.0 },
  ]
  const displayOrder = [podiumOrder[1], podiumOrder[0], podiumOrder[2]]

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-bebas text-7xl tracking-widest brand-gradient-text"
      >
        FINAL RESULTS
      </motion.h1>

      <div className="flex items-end justify-center gap-4">
        {displayOrder.map(({ rank, team, height, bg, medal, delay }) => (
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
                <div className="font-bebas text-3xl text-teal">{team.score} pts</div>
              </div>
            )}
            <div
              className={`w-40 flex items-center justify-center rounded-t-lg ${bg === 'brand-gradient' ? 'brand-gradient' : ''}`}
              style={{ height: `${height}px`, ...(bg !== 'brand-gradient' ? { backgroundColor: bg } : {}) }}
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
        className="brand-gradient text-white font-bebas text-2xl px-12 py-3 rounded-xl shadow-lg hover:opacity-90 transition-opacity mt-4"
      >
        PLAY AGAIN
      </motion.button>
    </div>
  )
}
