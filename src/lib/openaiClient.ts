import OpenAI from 'openai'

export function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('Missing OPENAI_API_KEY')
  return new OpenAI({ apiKey })
}

export async function openaiJson<T>(input: {
  model: string
  system: string
  user: string
}): Promise<T> {
  const client = getOpenAIClient()
  const resp = await client.chat.completions.create({
    model: input.model,
    temperature: 0.2,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: input.system },
      { role: 'user', content: input.user }
    ]
  })
  const content = resp.choices[0]?.message?.content
  if (!content) throw new Error('Empty model response')
  return JSON.parse(content) as T
}

