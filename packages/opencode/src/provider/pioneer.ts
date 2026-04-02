/**
 * Pioneer Provider — integration with Pioneer Server's unified inference API.
 *
 * Auth: JWT from wallet challenge-response (passed as apiKey in config).
 * The JWT is sent as Authorization: Bearer on every request.
 *
 * Extended timeouts for reasoning models that take 30-60s before first token.
 */
import { createOpenAICompatible } from "@ai-sdk/openai-compatible"

export function createPioneer(options: Record<string, any> = {}) {
  const baseURL = options.baseURL || "https://alpha.pioneers.dev/api/v1"
  const apiKey = options.apiKey || "not-needed"

  // Log auth status (once, on provider creation)
  const isJWT = apiKey.startsWith("eyJ")
  const isKey = apiKey.startsWith("sk-pioneer")
  if (isJWT) {
    console.error(`[pioneer-provider] Authenticated (JWT)`)
  } else if (isKey) {
    console.error(`[pioneer-provider] Authenticated (API key)`)
  } else if (apiKey === "not-needed" || apiKey === "pioneer-relay" || apiKey === "dummy-dev") {
    console.error(`[pioneer-provider] WARNING: No auth — requests will fail if server requires it`)
  }
  const originalFetch = options.fetch ?? globalThis.fetch

  const pioneerFetch = async (input: any, init?: any) => {
    const url = typeof input === "string" ? input : input?.url || "unknown"
    if (url.includes("/chat/completions")) {
      try {
        const body = JSON.parse(init?.body || "{}")
        console.error(`[pioneer-fetch] model=${body.model} stream=${body.stream} tools=${body.tools?.length || 0}`)
      } catch {}
    }

    // Remove abort signals -- reasoning models need minutes, not seconds
    if (init?.signal) {
      delete init.signal
    }

    return originalFetch(input, init)
  }

  // Spread options first, then override with our values (order matters!)
  const { fetch: _discardFetch, baseURL: _b, apiKey: _a, name: _n, ...rest } = options
  return createOpenAICompatible({
    ...rest,
    name: options.name || "pioneer",
    baseURL,
    apiKey,
    fetch: pioneerFetch as typeof globalThis.fetch,
  })
}
