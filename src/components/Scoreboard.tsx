import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Team } from '../types'

interface ScoreboardProps {
  teams: Team[]
  open: boolean
  onToggle: () => void
  onAddTeam: (name: string) => void
  onRemoveTeam: (id: string) => void
  onAddPoints: (id: string, points: number) => void
}

export default function Scoreboard({
  teams,
  open,
  onToggle,
  onAddTeam,
  onRemoveTeam,
  onAddPoints,
}: ScoreboardProps) {
  const [newName, setNewName] = useState('')

  const handleAdd = () => {
    const name = newName.trim()
    if (name) {
      onAddTeam(name)
      setNewName('')
    }
  }

  const sorted = [...teams].sort((a, b) => b.score - a.score)

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="fixed top-3 right-3 z-50 bg-teal hover:opacity-80 text-navy font-bebas text-lg px-4 py-2 rounded-lg transition-opacity shadow-lg"
      >
        {open ? 'HIDE SCORES' : 'SCORES'}
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 z-40 w-64 bg-[#071020] border-l-2 border-teal/50 shadow-2xl flex flex-col"
            style={{ paddingTop: '56px' }}
          >
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <h2 className="font-bebas text-2xl text-teal text-center tracking-widest">SCOREBOARD</h2>

              {sorted.map((team, idx) => (
                <div key={team.id} className="bg-white/10 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-bebas text-xl w-5 shrink-0">
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`}
                      </span>
                      <span className="text-white font-semibold truncate">{team.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-bebas text-2xl text-teal w-8 text-right">{team.score}</span>
                      <button
                        onClick={() => onRemoveTeam(team.id)}
                        className="text-white/40 hover:text-red-400 text-xs ml-1 transition-colors"
                        title="Remove team"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onAddPoints(team.id, 1)}
                      className="flex-1 bg-teal/20 hover:bg-teal/50 text-white text-sm font-bold py-1 rounded transition-colors"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => onAddPoints(team.id, 2)}
                      className="flex-1 bg-magenta/20 hover:bg-magenta/50 text-white text-sm font-bold py-1 rounded transition-colors"
                    >
                      +2
                    </button>
                    <button
                      onClick={() => onAddPoints(team.id, -1)}
                      className="flex-1 bg-red-900/30 hover:bg-red-900/60 text-white text-sm font-bold py-1 rounded transition-colors"
                    >
                      -1
                    </button>
                  </div>
                </div>
              ))}

              {teams.length === 0 && (
                <p className="text-white/40 text-center text-sm">No teams yet</p>
              )}
            </div>

            {/* Add team */}
            <div className="p-4 border-t border-teal/20">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                  placeholder="Team name..."
                  className="flex-1 bg-white/10 text-white placeholder-white/40 rounded px-3 py-2 text-sm outline-none border border-teal/30 focus:border-teal"
                />
                <button
                  onClick={handleAdd}
                  className="bg-teal hover:opacity-80 text-navy font-bebas px-3 py-2 rounded transition-opacity"
                >
                  ADD
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
