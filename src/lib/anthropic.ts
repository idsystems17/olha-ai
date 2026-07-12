import Anthropic from '@anthropic-ai/sdk'

// Chave só pode ser lida em código server-side (rota /api) — nunca em 'use client'.
export function createAnthropicClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
}
