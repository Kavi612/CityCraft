const PLACEHOLDER_KEYS = new Set(['your_xai_api_key_here', 'your_groq_api_key_here', 'your_key_here'])

export type LlmProvider = 'groq' | 'xai'

export type LlmConfig = {
  provider: LlmProvider
  apiKey: string
  apiUrl: string
  model: string
}

const PROVIDER_DEFAULTS: Record<
  LlmProvider,
  { apiUrl: string; model: string; envKeys: string[] }
> = {
  groq: {
    apiUrl: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'llama-3.3-70b-versatile',
    envKeys: ['GROQ_API_KEY'],
  },
  xai: {
    apiUrl: 'https://api.x.ai/v1/chat/completions',
    model: 'grok-2-latest',
    envKeys: ['GROK_API_KEY', 'XAI_API_KEY'],
  },
}

function readKey(names: string[]): string | undefined {
  for (const name of names) {
    const value = process.env[name]?.trim()
    if (value && !PLACEHOLDER_KEYS.has(value)) return value
  }
  return undefined
}

function detectProvider(): LlmProvider | undefined {
  const explicit = process.env.LLM_PROVIDER?.trim().toLowerCase()
  if (explicit === 'groq' || explicit === 'xai') return explicit

  if (readKey(PROVIDER_DEFAULTS.groq.envKeys)) return 'groq'
  if (readKey(PROVIDER_DEFAULTS.xai.envKeys)) return 'xai'
  return undefined
}

/** Resolve active LLM provider + credentials from backend/.env.local */
export function resolveLlmConfig(): LlmConfig | undefined {
  const provider = detectProvider()
  if (!provider) return undefined

  const defaults = PROVIDER_DEFAULTS[provider]
  const apiKey = readKey(defaults.envKeys)
  if (!apiKey) return undefined

  const model =
    provider === 'groq'
      ? (process.env.GROQ_MODEL?.trim() ?? defaults.model)
      : (process.env.GROK_MODEL?.trim() ?? defaults.model)

  return {
    provider,
    apiKey,
    apiUrl: defaults.apiUrl,
    model,
  }
}

/** @deprecated Use resolveLlmConfig() */
export function resolveApiKey(): string | undefined {
  return resolveLlmConfig()?.apiKey
}
