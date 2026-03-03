import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Screen, Team, GeneratedOptions } from './types'
import { ROUNDS } from './questions'
import { generateWrongAnswers } from './claude'
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

export default function App() {
  // API key
  const [apiKey, setApiKey] = useState<string>(
    () => import.meta.env.VITE_ANTHROPIC_API_KEY as string || localStorage.getItem('trivia_api_key') || ''
  )
  const [apiKeyInput, setApiKeyInput] = useState('')
  const [showApiSettings, setShowApiSettings] = useState(false)

  // Navigation
  const [screen, setScreen] = useState<Screen>('welcome')
  const [roundIndex, setRoundIndex] = useState(0)
  const [questionIndex, setQuestionIndex] = useState(0)

  // Question state
  const [revealed, setRevealed] = useState(false)
  const [optionsCache, setOptionsCache] = useState<Map<string, GeneratedOptions>>(new Map())
  const [isGenerating, setIsGenerating] = useState(false)
  const [generateError, setGenerateError] = useState<string | null>(null)

  // Timer
  const [timerDuration, setTimerDuration] = useState<30 | 60 | 90>(30)
  const [timerEnd, setTimerEnd] = useState<number | null>(null)
  const [timerActive, setTimerActive] = useState(false)

  // Teams
  const [teams, setTeams] = useState<Team[]>([])
  const [scoreboardOpen, setScoreboardOpen] = useState(false)

  const timerStopRef = useRef<() => void>(() => {})

  const currentRound = ROUNDS[roundIndex]
  const currentQuestion = currentRound?.questions[questionIndex]
  const cKey = cacheKey(roundIndex, questionIndex)
  const cachedOptions = optionsCache.get(cKey) ?? null

  // Stop timer on nav
  const stopTimer = useCallback(() => {
    setTimerActive(false)
    setTimerEnd(null)
  }, [])
  timerStopRef.current = stopTimer

  const navigate = useCallback((newRound: number, newQuestion: number) => {
    setRevealed(false)
    setGenerateError(null)
    stopTimer()
    setRoundIndex(newRound)
    setQuestionIndex(newQuestion)
  }, [stopTimer])

  const goToQuestion = useCallback((r: number, q: number) => {
    navigate(r, q)
    setScreen('question')
  }, [navigate])

  const handleNext = useCallback(() => {
    const qCount = currentRound.questions.length
    if (questionIndex < qCount - 1) {
      goToQuestion(roundIndex, questionIndex + 1)
    } else if (roundIndex < ROUNDS.length - 1) {
      navigate(roundIndex + 1, 0)
      setScreen('round-intro')
    } else {
      setScreen('final')
    }
  }, [roundIndex, questionIndex, currentRound, goToQuestion, navigate])

  const handlePrev = useCallback(() => {
    if (questionIndex > 0) {
      goToQuestion(roundIndex, questionIndex - 1)
    } else if (roundIndex > 0) {
      const prevRound = ROUNDS[roundIndex - 1]
      goToQuestion(roundIndex - 1, prevRound.questions.length - 1)
    }
  }, [roundIndex, questionIndex, goToQuestion])

  const handleRoundTab = useCallback((r: number) => {
    navigate(r, 0)
    setScreen('round-intro')
  }, [navigate])

  const handleRoundStart = useCallback(() => {
    setScreen('question')
  }, [])

  const handleGenerate = useCallback(async () => {
    if (!apiKey) {
      setGenerateError('Please enter your Anthropic API key in settings.')
      return
    }
    if (cachedOptions) return
    setIsGenerating(true)
    setGenerateError(null)
    try {
      const wrong = await generateWrongAnswers(apiKey, currentQuestion.question, currentQuestion.answer)
      const all = shuffle([currentQuestion.answer, ...wrong])
      const correctIndex = all.indexOf(currentQuestion.answer)
      const generated: GeneratedOptions = { options: all, correctIndex }
      setOptionsCache((prev) => new Map(prev).set(cKey, generated))
    } catch (e) {
      setGenerateError(e instanceof Error ? e.message : 'Failed to generate options')
    } finally {
      setIsGenerating(false)
    }
  }, [apiKey, cachedOptions, currentQuestion, cKey])

  const handleReveal = useCallback(() => {
    if (!cachedOptions) return
    setRevealed(true)
    // Confetti burst
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
      t.map((team) => team.id === id ? { ...team, score: Math.max(0, team.score + points) } : team)
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

  const handleSaveApiKey = () => {
    const key = apiKeyInput.trim()
    if (key) {
      setApiKey(key)
      localStorage.setItem('trivia_api_key', key)
      setApiKeyInput('')
      setShowApiSettings(false)
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (screen !== 'question') return
      if (e.target instanceof HTMLInputElement) return
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'r' || e.key === 'R') handleReveal()
      if (e.key === 'g' || e.key === 'G') handleGenerate()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [screen, handleNext, handlePrev, handleReveal, handleGenerate])

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-navy select-none">
      <Snowfall />
      <Mountains />

      {/* Main content */}
      <div className="relative z-10 w-full h-full flex flex-col">
        <AnimatePresence mode="wait">
          {screen === 'welcome' && (
            <WelcomeScreen
              key="welcome"
              apiKey={apiKey}
              apiKeyInput={apiKeyInput}
              setApiKeyInput={setApiKeyInput}
              onSaveKey={handleSaveApiKey}
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
                roundIndex={roundIndex}
                questionIndex={questionIndex}
                totalQuestions={currentRound.questions.length}
                timerDuration={timerDuration}
                timerEnd={timerEnd}
                timerActive={timerActive}
                onRoundTab={handleRoundTab}
                onTimerStart={handleTimerStart}
                onTimerStop={handleTimerStop}
                showTimer={false}
              />
              <div className="flex-1">
                <RoundIntro
                  roundNumber={roundIndex + 1}
                  roundTitle={currentRound.title}
                  questionCount={currentRound.questions.length}
                  onStart={handleRoundStart}
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
                roundIndex={roundIndex}
                questionIndex={questionIndex}
                totalQuestions={currentRound.questions.length}
                timerDuration={timerDuration}
                timerEnd={timerEnd}
                timerActive={timerActive}
                onRoundTab={handleRoundTab}
                onTimerStart={handleTimerStart}
                onTimerStop={handleTimerStop}
                showTimer
              />

              <div className="flex-1 flex flex-col px-6 pb-6 gap-4" style={{ paddingRight: scoreboardOpen ? '272px' : '80px' }}>
                {/* Round & question label */}
                <div className="font-bebas text-ice-blue text-xl tracking-widest mt-2">
                  ROUND {roundIndex + 1}: {currentRound.title}
                </div>

                {/* Question */}
                <div className="font-bebas text-white text-4xl leading-tight max-w-4xl">
                  {currentQuestion.question}
                </div>

                {/* Answer tiles */}
                <div className="grid grid-cols-2 gap-4 max-w-3xl flex-1 min-h-0" style={{ maxHeight: '280px' }}>
                  {TILE_LABELS.map((label, i) => {
                    const text = cachedOptions ? cachedOptions.options[i] : null
                    const isCorrect = cachedOptions ? i === cachedOptions.correctIndex : false
                    const isWrong = revealed && !isCorrect

                    let bg = TILE_COLORS[i]
                    let scale = 1
                    let opacity = 1

                    if (revealed && isCorrect) {
                      bg = '#22C55E'
                      scale = 1.04
                    } else if (revealed && isWrong) {
                      opacity = 0.35
                    }

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

                {/* Error */}
                {generateError && (
                  <div className="text-red-400 text-sm bg-red-900/20 rounded px-3 py-2 max-w-xl">
                    {generateError}
                  </div>
                )}

                {/* Controls */}
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !!cachedOptions}
                    className="bg-ice-blue hover:bg-blue-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bebas text-lg px-5 py-2 rounded-lg transition-colors"
                  >
                    {isGenerating ? 'GENERATING...' : cachedOptions ? 'OPTIONS READY' : 'GENERATE OPTIONS'}
                  </button>

                  {/* Timer buttons */}
                  {([30, 60, 90] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => timerActive ? handleTimerStop() : handleTimerStart(d)}
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

      {/* API key settings popover */}
      <div className="fixed bottom-3 left-3 z-50">
        <button
          onClick={() => setShowApiSettings((s) => !s)}
          className="text-white/40 hover:text-white/80 text-xs transition-colors"
        >
          ⚙ API Settings
        </button>
        <AnimatePresence>
          {showApiSettings && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-8 left-0 bg-navy border border-ice-blue/40 rounded-xl p-4 shadow-xl w-80"
            >
              <h3 className="font-bebas text-white text-xl mb-3">ANTHROPIC API KEY</h3>
              {apiKey && (
                <p className="text-white/50 text-xs mb-2">
                  Current: {apiKey.slice(0, 12)}...
                </p>
              )}
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveApiKey()}
                placeholder="sk-ant-..."
                className="w-full bg-white/10 text-white placeholder-white/30 rounded px-3 py-2 text-sm border border-ice-blue/30 focus:border-ice-blue outline-none mb-3"
              />
              <button
                onClick={handleSaveApiKey}
                className="w-full bg-gold hover:bg-yellow-400 text-navy font-bebas py-2 rounded-lg transition-colors"
              >
                SAVE KEY
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Top Bar ────────────────────────────────────────────────────────────────

interface TopBarProps {
  roundIndex: number
  questionIndex: number
  totalQuestions: number
  timerDuration: 30 | 60 | 90
  timerEnd: number | null
  timerActive: boolean
  onRoundTab: (r: number) => void
  onTimerStart: (d: 30 | 60 | 90) => void
  onTimerStop: () => void
  showTimer: boolean
}

function TopBar({
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
      {/* Round tabs */}
      <div className="flex gap-1">
        {ROUNDS.map((_, i) => (
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

      {/* Question counter */}
      <span className="text-white/60 text-sm font-mono">
        Q {questionIndex + 1}/{totalQuestions}
      </span>

      <div className="flex-1" />

      {/* Timer display */}
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

      {/* Spacer for scoreboard button */}
      <div className="w-28" />
    </div>
  )
}

// ─── Welcome Screen ──────────────────────────────────────────────────────────

interface WelcomeProps {
  apiKey: string
  apiKeyInput: string
  setApiKeyInput: (v: string) => void
  onSaveKey: () => void
  onStart: () => void
}

function WelcomeScreen({ apiKey, apiKeyInput, setApiKeyInput, onSaveKey, onStart }: WelcomeProps) {
  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col items-center justify-center gap-8 px-8"
    >
      {/* Olympic rings */}
      <div className="flex gap-4 mb-2">
        {['#1A3A5C', '#5B9BD5', '#C9A84C', '#CBD5E1', '#5B9BD5'].map((color, i) => (
          <div
            key={i}
            className="w-12 h-12 rounded-full border-4"
            style={{ borderColor: color }}
          />
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

      {!apiKey && (
        <div className="bg-white/10 rounded-xl p-6 w-full max-w-md border border-ice-blue/30">
          <h3 className="font-bebas text-white text-xl mb-1">ANTHROPIC API KEY REQUIRED</h3>
          <p className="text-white/50 text-sm mb-4">
            Used to generate wrong answer options via Claude AI
          </p>
          <input
            type="password"
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSaveKey()}
            placeholder="sk-ant-..."
            className="w-full bg-white/10 text-white placeholder-white/30 rounded-lg px-4 py-3 border border-ice-blue/30 focus:border-ice-blue outline-none mb-3"
          />
          <button
            onClick={onSaveKey}
            className="w-full bg-ice-blue hover:bg-blue-400 text-white font-bebas text-xl py-2 rounded-lg transition-colors"
          >
            SAVE API KEY
          </button>
        </div>
      )}

      <button
        onClick={onStart}
        className="bg-gold hover:bg-yellow-400 text-navy font-bebas text-3xl px-16 py-4 rounded-2xl transition-all shadow-2xl hover:scale-105 active:scale-95"
      >
        START GAME
      </button>

      {apiKey && (
        <p className="text-white/30 text-sm">API key loaded ✓</p>
      )}

      <div className="text-white/20 text-sm text-center">
        ← → arrow keys to navigate · G to generate · R to reveal
      </div>
    </motion.div>
  )
}
