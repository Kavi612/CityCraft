import type { LlmConfig } from './env.js'

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

type ChatCompletionOptions = {
  temperature?: number
  timeoutMs?: number
}

export async function chatCompletion(
  config: LlmConfig,
  messages: ChatMessage[],
  options: ChatCompletionOptions = {},
): Promise<string> {
  const temperature = options.temperature ?? 0.35
  const timeoutMs = options.timeoutMs ?? 45_000
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: config.model,
        temperature,
        messages,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      const label = config.provider === 'groq' ? 'Groq' : 'Grok'
      throw new Error(`${label} API error ${response.status}: ${errorText}`)
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>
    }

    const content = data.choices?.[0]?.message?.content
    if (!content) {
      throw new Error('LLM response contained no message content')
    }

    return content
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('LLM API request timed out')
    }
    throw error
  } finally {
    clearTimeout(timeout)
  }
}

export async function chatCompletionWithRetry(
  config: LlmConfig,
  messages: ChatMessage[],
  options?: ChatCompletionOptions,
): Promise<string> {
  try {
    return await chatCompletion(config, messages, options)
  } catch (firstError) {
    try {
      return await chatCompletion(config, messages, options)
    } catch {
      throw firstError
    }
  }
}
