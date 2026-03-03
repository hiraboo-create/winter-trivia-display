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

export interface Question {
  question: string
  answer: string
  wrongAnswers: [string, string, string]
}

export interface Round {
  title: string
  questions: Question[]
}
