import { useState, useEffect } from 'react'
import { Round, Question } from './types'
import { ROUNDS } from './questions'

// Milan–Cortina 2026 brand tile colors (match game exactly)
const TILE_COLORS = ['#0D2240', '#00C4CC', '#6B3CC8', '#E0197D']
const TILE_LABELS = ['A', 'B', 'C', 'D']

function loadRounds(): Round[] {
  try {
    const saved = localStorage.getItem('trivia_rounds')
    return saved ? (JSON.parse(saved) as Round[]) : ROUNDS
  } catch {
    return ROUNDS
  }
}

// ─── QuestionCard ─────────────────────────────────────────────────────────────

interface QuestionCardProps {
  roundIdx: number
  qIdx: number
  question: Question
  onUpdate: (ri: number, qi: number, q: Question) => void
  onDelete: (ri: number, qi: number) => void
}

function QuestionCard({ roundIdx, qIdx, question, onUpdate, onDelete }: QuestionCardProps) {
  const [questionText, setQuestionText] = useState(question.question)
  // answers[0] is always in the "correct" slot, indexed by correctIdx
  const [answers, setAnswers] = useState<[string, string, string, string]>([
    question.answer,
    question.wrongAnswers[0],
    question.wrongAnswers[1],
    question.wrongAnswers[2],
  ])
  const [correctIdx, setCorrectIdx] = useState(0)

  // Sync if parent question changes (e.g. after reset)
  useEffect(() => {
    setQuestionText(question.question)
    setAnswers([question.answer, question.wrongAnswers[0], question.wrongAnswers[1], question.wrongAnswers[2]])
    setCorrectIdx(0)
  }, [question.question, question.answer, question.wrongAnswers[0], question.wrongAnswers[1], question.wrongAnswers[2]])

  function save(
    newQuestionText: string,
    newAnswers: [string, string, string, string],
    newCorrectIdx: number
  ) {
    const correct = newAnswers[newCorrectIdx]
    const wrong = newAnswers.filter((_, i) => i !== newCorrectIdx) as [string, string, string]
    onUpdate(roundIdx, qIdx, { question: newQuestionText, answer: correct, wrongAnswers: wrong })
  }

  function handleQuestionChange(val: string) {
    setQuestionText(val)
    save(val, answers, correctIdx)
  }

  function handleAnswerChange(i: number, val: string) {
    const updated = [...answers] as [string, string, string, string]
    updated[i] = val
    setAnswers(updated)
    save(questionText, updated, correctIdx)
  }

  function handleSetCorrect(i: number) {
    setCorrectIdx(i)
    save(questionText, answers, i)
  }

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '12px',
      }}
    >
      {/* Question header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
        <span
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '18px',
            color: '#00C4CC',
            whiteSpace: 'nowrap',
            lineHeight: '1',
            paddingTop: '6px',
          }}
        >
          Q{qIdx + 1}
        </span>
        <textarea
          value={questionText}
          onChange={(e) => handleQuestionChange(e.target.value)}
          rows={2}
          placeholder="Question text…"
          style={{
            flex: 1,
            background: 'rgba(255,255,255,0.08)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '8px',
            padding: '6px 10px',
            fontSize: '14px',
            resize: 'vertical',
            outline: 'none',
            fontFamily: 'inherit',
          }}
        />
        <button
          onClick={() => onDelete(roundIdx, qIdx)}
          title="Delete this question"
          style={{
            background: 'none',
            border: '1px solid rgba(255,80,80,0.4)',
            color: 'rgba(255,100,100,0.7)',
            borderRadius: '6px',
            padding: '4px 10px',
            fontSize: '12px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,80,80,0.15)'
            ;(e.currentTarget as HTMLButtonElement).style.color = '#ff6060'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.background = 'none'
            ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,100,100,0.7)'
          }}
        >
          Delete
        </button>
      </div>

      {/* Answer tiles — 2×2 grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
        }}
      >
        {answers.map((ans, i) => {
          const isCorrect = i === correctIdx
          const tileColor = TILE_COLORS[i]
          // For dark navy tile, use teal for the label color
          const labelColor = tileColor === '#0D2240' ? '#00C4CC' : tileColor

          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: isCorrect ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.05)',
                border: isCorrect ? '1px solid #22c55e' : '1px solid rgba(255,255,255,0.15)',
                borderRadius: '8px',
                padding: '6px 10px',
                transition: 'all 0.2s',
              }}
            >
              {/* Star (correct marker) */}
              <button
                onClick={() => handleSetCorrect(i)}
                title="Mark as correct answer"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '18px',
                  color: isCorrect ? '#22c55e' : 'rgba(255,255,255,0.2)',
                  padding: '0',
                  lineHeight: '1',
                  transition: 'color 0.15s',
                  flexShrink: 0,
                }}
              >
                ★
              </button>

              {/* Tile label */}
              <span
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '16px',
                  color: labelColor,
                  flexShrink: 0,
                  width: '16px',
                }}
              >
                {TILE_LABELS[i]}
              </span>

              {/* Answer input */}
              <input
                type="text"
                value={ans}
                onChange={(e) => handleAnswerChange(i, e.target.value)}
                placeholder={`Option ${TILE_LABELS[i]}`}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontSize: '13px',
                  outline: 'none',
                  fontFamily: 'inherit',
                  minWidth: 0,
                }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── AdminPage ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [rounds, setRounds] = useState<Round[]>(loadRounds)
  const [activeRound, setActiveRound] = useState(0)
  const [savedFlash, setSavedFlash] = useState(false)

  // Auto-save on rounds change
  useEffect(() => {
    localStorage.setItem('trivia_rounds', JSON.stringify(rounds))
    setSavedFlash(true)
    const t = setTimeout(() => setSavedFlash(false), 1500)
    return () => clearTimeout(t)
  }, [rounds])

  function updateQuestion(ri: number, qi: number, q: Question) {
    setRounds((prev) =>
      prev.map((round, rIdx) =>
        rIdx !== ri
          ? round
          : {
              ...round,
              questions: round.questions.map((oldQ, qIdx) => (qIdx !== qi ? oldQ : q)),
            }
      )
    )
  }

  function addQuestion(ri: number) {
    setRounds((prev) =>
      prev.map((round, rIdx) =>
        rIdx !== ri
          ? round
          : {
              ...round,
              questions: [...round.questions, { question: '', answer: '', wrongAnswers: ['', '', ''] }],
            }
      )
    )
  }

  function deleteQuestion(ri: number, qi: number) {
    if (!confirm(`Delete Q${qi + 1}? This cannot be undone.`)) return
    setRounds((prev) =>
      prev.map((round, rIdx) =>
        rIdx !== ri
          ? round
          : {
              ...round,
              questions: round.questions.filter((_, qIdx) => qIdx !== qi),
            }
      )
    )
  }

  function resetAll() {
    if (!confirm('Reset ALL questions to the original defaults? This cannot be undone.')) return
    setRounds(ROUNDS)
    localStorage.removeItem('trivia_rounds')
  }

  const currentRound = rounds[activeRound]

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#071020',
        color: '#fff',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: '#071020',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {/* Title row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 20px',
          }}
        >
          <span
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '28px',
              color: '#00C4CC',
              letterSpacing: '0.1em',
              flex: 1,
            }}
          >
            ❄ QUESTION EDITOR
          </span>

          {savedFlash && (
            <span
              style={{
                color: '#22c55e',
                fontSize: '13px',
                fontWeight: 500,
                transition: 'opacity 0.3s',
              }}
            >
              ✓ Saved
            </span>
          )}

          <a
            href="/"
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              padding: '6px 14px',
              textDecoration: 'none',
              fontSize: '13px',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.2)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.1)'
            }}
          >
            ← Back to Game
          </a>
        </div>

        {/* Warning banner */}
        <div
          style={{
            background: 'rgba(234,179,8,0.1)',
            borderTop: '1px solid rgba(234,179,8,0.3)',
            borderBottom: '1px solid rgba(234,179,8,0.3)',
            padding: '8px 20px',
            fontSize: '13px',
            color: 'rgba(255,255,255,0.7)',
          }}
        >
          ⚠ Changes apply when the game is next started. Safe to edit while a game is running in another tab.
        </div>

        {/* Round tabs + Reset All */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 20px',
            gap: '8px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div style={{ display: 'flex', gap: '6px', flex: 1, flexWrap: 'wrap' }}>
            {rounds.map((round, i) => (
              <button
                key={i}
                onClick={() => setActiveRound(i)}
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '16px',
                  padding: '4px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  background: i === activeRound ? '#00C4CC' : 'rgba(255,255,255,0.1)',
                  color: i === activeRound ? '#071020' : 'rgba(255,255,255,0.7)',
                  transition: 'all 0.15s',
                }}
              >
                R{i + 1} {round.title}
              </button>
            ))}
          </div>

          <button
            onClick={resetAll}
            style={{
              background: 'none',
              border: '1px solid rgba(255,80,80,0.4)',
              color: 'rgba(255,100,100,0.7)',
              borderRadius: '6px',
              padding: '4px 12px',
              fontSize: '12px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,80,80,0.15)'
              ;(e.currentTarget as HTMLButtonElement).style.color = '#ff6060'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.background = 'none'
              ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,100,100,0.7)'
            }}
          >
            Reset All
          </button>
        </div>
      </div>

      {/* Question list */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <div
          style={{
            marginBottom: '12px',
            fontSize: '12px',
            color: 'rgba(255,255,255,0.4)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          {currentRound.questions.length} question{currentRound.questions.length !== 1 ? 's' : ''} — ★ marks the correct answer
        </div>

        {currentRound.questions.map((q, qi) => (
          <QuestionCard
            key={`${activeRound}-${qi}`}
            roundIdx={activeRound}
            qIdx={qi}
            question={q}
            onUpdate={updateQuestion}
            onDelete={deleteQuestion}
          />
        ))}

        {/* Add question button */}
        <button
          onClick={() => addQuestion(activeRound)}
          style={{
            display: 'block',
            width: '100%',
            padding: '12px',
            background: 'rgba(0,196,204,0.08)',
            border: '1px dashed rgba(0,196,204,0.4)',
            borderRadius: '10px',
            color: '#00C4CC',
            fontSize: '15px',
            fontFamily: "'Bebas Neue', sans-serif",
            letterSpacing: '0.1em',
            cursor: 'pointer',
            transition: 'all 0.15s',
            marginTop: '4px',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,196,204,0.15)'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,196,204,0.08)'
          }}
        >
          + ADD QUESTION
        </button>
      </div>
    </div>
  )
}
