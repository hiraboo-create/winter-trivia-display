import Anthropic from '@anthropic-ai/sdk'

export async function generateWrongAnswers(
  apiKey: string,
  question: string,
  correctAnswer: string
): Promise<string[]> {
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })

  const prompt = `You are helping generate trivia wrong answers for a Winter Olympics quiz night.

Question: ${question}
Correct Answer: ${correctAnswer}

Generate exactly 3 plausible but incorrect answer options. They should:
- Be believable enough to be tricky
- Be roughly the same type/format as the correct answer
- Not be obviously wrong
- Be concise (similar length to the correct answer)

Respond with ONLY a JSON array of 3 strings, no other text. Example:
["Wrong Answer 1", "Wrong Answer 2", "Wrong Answer 3"]`

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 256,
    messages: [{ role: 'user', content: prompt }],
  })

  const content = message.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response type')

  const parsed = JSON.parse(content.text.trim()) as unknown
  if (!Array.isArray(parsed) || parsed.length !== 3) {
    throw new Error('Expected array of 3 strings')
  }
  return parsed as string[]
}
