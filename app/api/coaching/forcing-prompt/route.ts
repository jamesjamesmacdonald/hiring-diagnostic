// POST /api/coaching/forcing-prompt
// Edits one-sentence success criteria. Per BUILD_SPEC.md Section 10.

import { NextResponse } from 'next/server';
import { getAnthropic, MODEL, textFromMessage } from '@/lib/claude';

export const runtime = 'nodejs';

const SYSTEM = `You edit one-sentence success criteria for James MacDonald, who runs NTP Talent and hosts Building Tech Teams. The user has written a success criterion for a hire. Your job: check it and rewrite if needed.

Required form: "I will know this hire worked when [specific outcome] by [specific date], because [evidence I have today]."

REJECT and REWRITE if the sentence:
- Uses hedging words (probably, maybe, hopefully, should, might).
- Uses filler words (genuinely, honestly, just, really, very).
- Lacks a specific outcome (avoid: "settled in," "contributing," "growing").
- Lacks a date or timeframe.
- Lacks evidence basis.

ACCEPT if the sentence has:
- A specific observable outcome.
- A specific date or timeframe.
- A specific evidence the user has today.

VOICE RULES for your rewrite:
- No em dashes.
- Active voice.
- Short sentences.
- No hedging or filler.

OUTPUT (JSON only, no prose):
{
  "accepted": true | false,
  "feedback": "one sentence explaining why if not accepted",
  "rewrite": "your rewritten version if not accepted, in James's voice"
}`;

type Result = {
  accepted: boolean;
  feedback: string;
  rewrite: string;
};

export async function POST(req: Request) {
  let sentence: string;
  try {
    const body = await req.json();
    sentence = typeof body?.sentence === 'string' ? body.sentence : '';
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!sentence.trim()) {
    return NextResponse.json(
      { error: 'sentence is required' },
      { status: 400 }
    );
  }

  try {
    const msg = await getAnthropic().messages.create({
      model: MODEL,
      max_tokens: 500,
      system: SYSTEM,
      messages: [{ role: 'user', content: sentence.trim() }],
    });

    const text = textFromMessage(msg);
    let parsed: Result;
    try {
      parsed = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: 'AI returned invalid JSON', raw: text },
        { status: 502 }
      );
    }

    return NextResponse.json(parsed);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
