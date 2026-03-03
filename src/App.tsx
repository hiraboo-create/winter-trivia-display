import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Screen, Team, GeneratedOptions, Round } from './types'
import { ROUNDS } from './questions'
import Snowfall from './components/Snowfall'
import Mountains from './components/Mountains'
import Timer from './components/Timer'
import Scoreboard from './components/Scoreboard'
import RoundIntro from './components/RoundIntro'
import Podium from './components/Podium'

const TILE_COLORS = ['#1A3A5C', '#5B9BD5', '#C9A84C', '#CBD5E1']
const TILE_LABELS = ['A', 'B', 'C', 'D']

function cacheKey(r: number, q: number) {
  return `${r}-${q}`
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function loadRounds(): Round[] {
  try {
    const saved = localStorage.getItem('trivia_rounds')
    return saved ? (JSON.parse(saved) as Round[]) : ROUNDS
  } catch {
    return ROUNDS
  }
}

export default function App() {
  // Rounds state — editable, persisted to localStorage
  const [rounds, setRounds] = useState<Round[]>(loadRounds)

  useEffect(() => {
    localStorage.setItem('trivia_rounds', JSON.stringify(rounds))
  }, [rounds])

  // Navigation
  const [screen, setScreen] = useState<Screen>('welcome')
  const [roundIndex, setRoundIndex] = useState(0)
  const [questionIndex, setQuestionIndex] = useState(0)

  // Question state
  const [revealed, setRevealed] = useState(false)
  const [optionsCache, setOptionsCache] = useState<Map<string, GeneratedOptions>>(new Map())

  // Timer
  const [timerDuration, setTimerDuration] = useState<30 | 60 | 90>(30)
  const [timerEnd, setTimerEnd] = useState<number | null>(null)
  const [timerActive, setTimerActive] = useState(false)

  // Teams
  const [teams, setTeams] = useState<Team[]>([])
  const [scoreboardOpen, setScoreboardOpen] = useState(false)

  // Edit modal
  const [showEditModal, setShowEditModal] = useState(false)
  const [editQ, setEditQ] = useState('')
  const [editOpts, setEditOpts] = useState<[string, string, string, string]>(['', '', '', ''])
  const [editCorrect, setEditCorrect] = useState(0)

  const currentRound = rounds[roundIndex]
  const currentQuestion = currentRound?.questions[questionIndex]
  const cKey = cacheKey(roundIndex, questionIndex)
  const cachedOptions = optionsCache.get(cKey) ?? null

  const stopTimer = useCallback(() => {
    setTimerActive(false)
    setTimerEnd(null)
  }, [])

  const navigate = useCallback(
    (newRound: number, newQuestion: number) => {
      setRevealed(false)
      stopTimer()
      setRoundIndex(newRound)
      setQuestionIndex(newQuestion)
    },
    [stopTimer]
  )

  const goToQuestion = useCallback(
    (r: number, q: number) => {
      navigate(r, q)
      setScreen('question')
    },
    [navigate]
  )

  const handleNext = useCallback(() => {
    const qCount = currentRound.questions.length
    if (questionIndex < qCount - 1) {
      goToQuestion(roundIndex, questionIndex + 1)
    } else if (roundIndex < rounds.length - 1) {
      navigate(roundIndex + 1, 0)
      setScreen('round-intro')
    } else {
      setScreen('final')
    }
  }, [roundIndex, questionIndex, currentRound, rounds.length, goToQuestion, navigate])

  const handlePrev = useCallback(() => {
    if (questionIndex > 0) {
      goToQuestion(roundIndex, questionIndex - 1)
    } else if (roundIndex > 0) {
      const prevRound = rounds[roundIndex - 1]
      goToQuestion(roundIndex - 1, prevRound.questions.length - 1)
    }
  }, [roundIndex, questionIndex, rounds, goToQuestion])

  const handleRoundTab = useCallback(
    (r: number) => {
      navigate(r, 0)
      setScreen('round-intro')
    },
    [navigate]
  )

  // Generate options instantly from hardcoded data
  const handleGenerate = useCallback(() => {
    if (cachedOptions) return
    const q = currentQuestion
    const all = shuffle([q.answer, ...q.wrongAnswers])
    const correctIndex = all.indexOf(q.answer)
    setOptionsCache((prev) => new Map(prev).set(cKey, { options: all, correctIndex }))
  }, [cachedOptions, currentQuestion, cKey])

  const handleReveal = useCallback(() => {
    if (!cachedOptions) return
    setRevealed(true)
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#C9A84C', '#5B9BD5', '#ffffff'],
    })
  }, [cachedOptions])

  const handleTimerStart = useCallback((dur: 30 | 60 | 90) => {
    setTimerDuration(dur)
    setTimerEnd(Date.now() + dur * 1000)
    setTimerActive(true)
  }, [])

  const handleTimerStop = useCallback(() => {
    setTimerActive(false)
    setTimerEnd(null)
  }, [])

  const handleAddTeam = useCallback((name: string) => {
    setTeams((t) => [...t, { id: crypto.randomUUID(), name, score: 0 }])
  }, [])

  const handleRemoveTeam = useCallback((id: string) => {
    setTeams((t) => t.filter((team) => team.id !== id))
  }, [])

  const handleAddPoints = useCallback((id: string, points: number) => {
    setTeams((t) =>
      t.map((team) => (team.id === id ? { ...team, score: Math.max(0, team.score + points) } : team))
    )
  }, [])

  const handleRestart = useCallback(() => {
    setScreen('welcome')
    setRoundIndex(0)
    setQuestionIndex(0)
    setRevealed(false)
    setOptionsCache(new Map())
    stopTimer()
    setTeams([])
  }, [stopTimer])

  // ── Edit modal ────────────────────────────────────────────────────────────

  const openEdit = useCallback(() => {
    const q = currentQuestion
    if (cachedOptions) {
      setEditOpts(cachedOptions.options as [string, string, string, string])
      setEditCorrect(cachedOptions.correctIndex)
    } else {
      setEditOpts([q.answer, ...q.wrongAnswers] as [string, string, string, string])
      setEditCorrect(0)
    }
    setEditQ(q.question)
    setShowEditModal(true)
  }, [currentQuestion, cachedOptions])

  const saveEdit = useCallback(() => {
    const trimmedQ = editQ.trim()
    if (!trimmedQ) return
    const trimmedOpts = editOpts.map((o) => o.trim()) as [string, string, string, string]

    setRounds((prev) =>
      prev.map((round, ri) =>
        ri !== roundIndex
          ? round
          : {
              ...round,
              questions: round.questions.map((q, qi) =>
                qi !== questionIndex
                  ? q
                  : {
                      question: trimmedQ,
                      answer: trimmedOpts[editCorrect],
                      wrongAnswers: trimmedOpts.filter((_, i) => i !== editCorrect) as [
                        string,
                        string,
                        string,
                      ],
                    }
              ),
            }
      )
    )
    // Update cache so the display is immediately correct
    setOptionsCache((prev) =>
      new Map(prev).set(cKey, { options: [...trimmedOpts], correctIndex: editCorrect })
    )
    setShowEditModal(false)
  }, [editQ, editOpts, editCorrect, roundIndex, questionIndex, cKey])

  const resetToDefaults = useCallback(() => {
    if (!confirm('Reset ALL questions to the original defaults? This cannot be undone.')) return
    setRounds(ROUNDS)
    setOptionsCache(new Map())
    localStorage.removeItem('trivia_rounds')
    setShowEditModal(false)
  }, [])

  // ── Keyboard shortcuts ───────────────────────────────────────────────────

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (screen !== 'question') return
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (showEditModal) return
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'r' || e.key === 'R') handleReveal()
      if (e.key === 'g' || e.key === 'G') handleGenerate()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [screen, showEditModal, handleNext, handlePrev, handleReveal, handleGenerate])

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-navy select-none">
      <Snowfall />
      <Mountains />

      <div className="relative z-10 w-full h-full flex flex-col">
        <AnimatePresence mode="wait">
          {screen === 'welcome' && (
            <WelcomeScreen
              key="welcome"
              onStart={() => {
                setScreen('round-intro')
                setRoundIndex(0)
                setQuestionIndex(0)
              }}
            />
          )}

          {screen === 'round-intro' && (
            <motion.div
              key={`round-intro-${roundIndex}`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              className="flex-1 flex flex-col"
            >
              <TopBar
                rounds={rounds}
                roundIndex={roundIndex}
                questionIndex={questionIndex}
                totalQuestions={currentRound.questions.length}
                timerDuration={timerDuration}
                timerEnd={timerEnd}
                timerActive={timerActive}
                onRoundTab={handleRoundTab}
                onTimerStop={handleTimerStop}
                showTimer={false}
              />
              <div className="flex-1">
                <RoundIntro
                  roundNumber={roundIndex + 1}
                  roundTitle={currentRound.title}
                  questionCount={currentRound.questions.length}
                  onStart={() => setScreen('question')}
                />
              </div>
            </motion.div>
          )}

          {screen === 'question' && currentQuestion && (
            <motion.div
              key={`question-${roundIndex}-${questionIndex}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
              className="flex-1 flex flex-col"
            >
              <TopBar
                rounds={rounds}
                roundIndex={roundIndex}
                questionIndex={questionIndex}
                totalQuestions={currentRound.questions.length}
                timerDuration={timerDuration}
                timerEnd={timerEnd}
                timerActive={timerActive}
                onRoundTab={handleRoundTab}
                onTimerStop={handleTimerStop}
                showTimer
              />

              <div
                className="flex-1 flex flex-col px-6 pb-6 gap-4"
                style={{ paddingRight: scoreboardOpen ? '272px' : '80px' }}
              >
                {/* Round label + edit button */}
                <div className="flex items-center gap-3 mt-2">
                  <div className="font-bebas text-ice-blue text-xl tracking-widest">
                    ROUND {roundIndex + 1}: {currentRound.title}
                  </div>
                  <button
                    onClick={openEdit}
                    title="Edit this question"
                    className="text-white/30 hover:text-gold transition-colors text-lg"
                  >
                    ✏
                  </button>
                </div>

                {/* Question */}
                <div className="font-bebas text-white text-4xl leading-tight max-w-4xl">
                  {currentQuestion.question}
                </div>

                {/* Answer tiles */}
                <div
                  className="grid grid-cols-2 gap-4 max-w-3xl flex-1 min-h-0"
                  style={{ maxHeight: '280px' }}
                >
                  {TILE_LABELS.map((label, i) => {
                    const text = cachedOptions ? cachedOptions.options[i] : null
                    const isCorrect = cachedOptions ? i === cachedOptions.correctIndex : false
                    const isWrong = revealed && !isCorrect
                    let bg = TILE_COLORS[i]
                    let scale = 1
                    let opacity = 1
                    if (revealed && isCorrect) { bg = '#22C55E'; scale = 1.04 }
                    else if (revealed && isWrong) { opacity = 0.35 }

                    return (
                      <motion.div
                        key={i}
                        animate={{ scale, opacity }}
                        transition={{ duration: 0.3 }}
                        className="rounded-xl p-4 flex items-center gap-4 shadow-lg"
                        style={{ backgroundColor: bg }}
                      >
                        <span className="font-bebas text-3xl text-white/80 w-8 shrink-0">{label}</span>
                        <span className="font-bebas text-2xl text-white leading-tight">
                          {text ?? '———'}
                        </span>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={handleGenerate}
                    disabled={!!cachedOptions}
                    className="bg-ice-blue hover:bg-blue-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bebas text-lg px-5 py-2 rounded-lg transition-colors"
                  >
                    {cachedOptions ? 'OPTIONS READY' : 'SHOW OPTIONS'}
                  </button>

                  {([30, 60, 90] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => (timerActive && timerDuration === d ? handleTimerStop() : handleTimerStart(d))}
                      className={`font-bebas text-lg px-4 py-2 rounded-lg transition-colors ${
                        timerActive && timerDuration === d
                          ? 'bg-red-500 hover:bg-red-400 text-white'
                          : 'bg-white/20 hover:bg-white/30 text-white'
                      }`}
                    >
                      {timerActive && timerDuration === d ? 'STOP' : `${d}s`}
                    </button>
                  ))}

                  <button
                    onClick={handleReveal}
                    disabled={!cachedOptions || revealed}
                    className="bg-gold hover:bg-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed text-navy font-bebas text-lg px-5 py-2 rounded-lg transition-colors"
                  >
                    {revealed ? 'REVEALED!' : 'REVEAL ANSWER'}
                  </button>

                  <div className="ml-auto flex gap-2">
                    <button
                      onClick={handlePrev}
                      disabled={roundIndex === 0 && questionIndex === 0}
                      className="bg-white/20 hover:bg-white/30 disabled:opacity-30 text-white font-bebas text-xl px-4 py-2 rounded-lg transition-colors"
                    >
                      ←
                    </button>
                    <button
                      onClick={handleNext}
                      className="bg-white/20 hover:bg-white/30 text-white font-bebas text-xl px-4 py-2 rounded-lg transition-colors"
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {screen === 'final' && (
            <motion.div
              key="final"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1"
            >
              <Podium teams={teams} onRestart={handleRestart} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scoreboard */}
      <Scoreboard
        teams={teams}
        open={scoreboardOpen}
        onToggle={() => setScoreboardOpen((o) => !o)}
        onAddTeam={handleAddTeam}
        onRemoveTeam={handleRemoveTeam}
        onAddPoints={handleAddPoints}
      />

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4"
            onClick={(e) => e.target === e.currentTarget && setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0F2540] border border-ice-blue/40 rounded-2xl p-6 w-full max-w-2xl shadow-2xl"
            >
              <h2 className="font-bebas text-gold text-3xl tracking-widest mb-4">
                EDIT QUESTION — R{roundIndex + 1} Q{questionIndex + 1}
              </h2>

              {/* Question text */}
              <label className="text-white/60 text-xs uppercase tracking-widest mb-1 block">Question</label>
              <textarea
                value={editQ}
                onChange={(e) => setEditQ(e.target.value)}
                rows={2}
                className="w-full bg-white/10 text-white rounded-lg px-3 py-2 text-lg border border-ice-blue/30 focus:border-ice-blue outline-none resize-none mb-4"
              />

              {/* Answer options */}
              <label className="text-white/60 text-xs uppercase tracking-widest mb-2 block">
                Answers — click <span className="text-green-400">★ mark correct</span>
              </label>
              <div className="grid grid-cols-2 gap-3 mb-5">
                {editOpts.map((opt, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2 rounded-lg border p-2 transition-colors ${
                      editCorrect === i ? 'border-green-400 bg-green-900/20' : 'border-white/20 bg-white/5'
                    }`}
                  >
                    <button
                      onClick={() => setEditCorrect(i)}
                      title="Mark as correct answer"
                      className={`shrink-0 text-xl transition-colors ${
                        editCorrect === i ? 'text-green-400' : 'text-white/20 hover:text-white/60'
                      }`}
                    >
                      ★
                    </button>
                    <span
                      className="font-bebas text-lg shrink-0"
                      style={{ color: TILE_COLORS[i] === '#1A3A5C' ? '#5B9BD5' : TILE_COLORS[i] }}
                    >
                      {TILE_LABELS[i]}
                    </span>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const updated = [...editOpts] as [string, string, string, string]
                        updated[i] = e.target.value
                        setEditOpts(updated)
                      }}
                      className="flex-1 bg-transparent text-white text-sm outline-none placeholder-white/30"
                      placeholder={`Option ${TILE_LABELS[i]}`}
                    />
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-between">
                <button
                  onClick={resetToDefaults}
                  className="text-white/30 hover:text-red-400 text-sm transition-colors"
                >
                  Reset all to defaults
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="bg-white/10 hover:bg-white/20 text-white font-bebas text-lg px-6 py-2 rounded-lg transition-colors"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={saveEdit}
                    className="bg-gold hover:bg-yellow-400 text-navy font-bebas text-lg px-8 py-2 rounded-lg transition-colors"
                  >
                    SAVE
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard hint */}
      {screen === 'question' && (
        <div className="fixed bottom-2 left-3 z-20 text-white/20 text-xs pointer-events-none">
          ← → navigate · G show options · R reveal · ✏ edit question
        </div>
      )}
    </div>
  )
}

// ─── Top Bar ────────────────────────────────────────────────────────────────

interface TopBarProps {
  rounds: Round[]
  roundIndex: number
  questionIndex: number
  totalQuestions: number
  timerDuration: 30 | 60 | 90
  timerEnd: number | null
  timerActive: boolean
  onRoundTab: (r: number) => void
  onTimerStop: () => void
  showTimer: boolean
}

function TopBar({
  rounds,
  roundIndex,
  questionIndex,
  totalQuestions,
  timerDuration,
  timerEnd,
  timerActive,
  onRoundTab,
  onTimerStop,
  showTimer,
}: TopBarProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border-b border-white/10 z-20">
      <div className="flex gap-1">
        {rounds.map((_, i) => (
          <button
            key={i}
            onClick={() => onRoundTab(i)}
            className={`font-bebas text-lg px-3 py-1 rounded transition-colors ${
              i === roundIndex
                ? 'bg-ice-blue text-white'
                : 'text-white/50 hover:text-white hover:bg-white/10'
            }`}
          >
            R{i + 1}
          </button>
        ))}
      </div>

      <div className="w-px h-6 bg-white/20" />

      <span className="text-white/60 text-sm font-mono">
        Q {questionIndex + 1}/{totalQuestions}
      </span>

      <div className="flex-1" />

      {showTimer && timerActive && (
        <div onClick={onTimerStop} className="cursor-pointer">
          <Timer
            duration={timerDuration}
            timerEnd={timerEnd}
            timerActive={timerActive}
            onStop={onTimerStop}
          />
        </div>
      )}

      <div className="w-28" />
    </div>
  )
}

// ─── Welcome Screen ──────────────────────────────────────────────────────────

function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col items-center justify-center gap-8 px-8"
    >
      <div className="flex gap-4 mb-2">
        {['#1A3A5C', '#5B9BD5', '#C9A84C', '#CBD5E1', '#5B9BD5'].map((color, i) => (
          <div key={i} className="w-12 h-12 rounded-full border-4" style={{ borderColor: color }} />
        ))}
      </div>

      <div className="text-center">
        <h1 className="font-bebas text-8xl text-white leading-none tracking-widest">
          WINTER TRIVIA
        </h1>
        <h2 className="font-bebas text-4xl text-gold tracking-widest mt-1">
          MILAN – CORTINA 2026
        </h2>
        <p className="text-white/50 mt-3 text-lg">5 Rounds · 50 Questions · Company Trivia Night</p>
      </div>

      <button
        onClick={onStart}
        className="bg-gold hover:bg-yellow-400 text-navy font-bebas text-3xl px-16 py-4 rounded-2xl transition-all shadow-2xl hover:scale-105 active:scale-95"
      >
        START GAME
      </button>

      <div className="text-white/20 text-sm text-center">
        ← → arrow keys to navigate · G to show options · R to reveal · ✏ to edit questions
      </div>
    </motion.div>
  )
}
