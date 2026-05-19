// Anthropic SDK wrapper. Lazy-init so static build does not require the env var.

import Anthropic from '@anthropic-ai/sdk';

let client: Anthropic | null = null;

export function getAnthropic(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set');
    client = new Anthropic({ apiKey });
  }
  return client;
}

export const MODEL = 'claude-sonnet-4-6';

// Helper: extract concatenated text from an Anthropic Message response.
export function textFromMessage(msg: Anthropic.Messages.Message): string {
  return msg.content
    .filter((c): c is Anthropic.Messages.TextBlock => c.type === 'text')
    .map((c) => c.text)
    .join('');
}
