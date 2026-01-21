export type OllamaRole = 'system' | 'user' | 'assistant'
export type OllamaMessage = { role: OllamaRole; content: string }

/**
 * Ollama streaming (NDJSON) via Vite proxy: /ollama -> http://127.0.0.1:11434
 * Request: POST /ollama/api/chat
 */
export async function ollamaChatStream(params: {
  model: string
  messages: OllamaMessage[]
  onToken: (t: string) => void
  signal?: AbortSignal
}): Promise<void> {
  const res = await fetch('/ollama/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: params.model, messages: params.messages, stream: true }),
    signal: params.signal,
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Ollama HTTP ${res.status}${text ? `: ${text}` : ''}`)
  }

  if (!res.body) throw new Error('Ollama: no response body')

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { value, done } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      const s = line.trim()
      if (!s) continue
      try {
        const obj = JSON.parse(s)
        const token = obj?.message?.content
        if (token) params.onToken(String(token))
        if (obj?.done) return
      } catch {
        // ignore broken partial json line
      }
    }
  }
}
