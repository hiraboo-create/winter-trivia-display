export interface Team {
  id: string
  name: string
  score: number
}

export interface GeneratedOptions {
  options: string[]      // 4 shuffled answers
  correctIndex: number   // index of correct answer in options
}

export type Screen = 'welcome' | 'round-intro' | 'question' | 'final'

export interface AppState {
  screen: Screen
  roundIndex: number
  questionIndex: number
  revealed: boolean
  optionsCache: Map<string, GeneratedOptions>
  isGenerating: boolean
  timerDuration: 30 | 60 | 90 | null
  timerEnd: number | null
  timerActive: boolean
  teams: Team[]
  scoreboardOpen: boolean
  apiKey: string
}

export interface Question {
  question: string
  answer: string
}

export interface Round {
  title: string
  questions: Question[]
}
