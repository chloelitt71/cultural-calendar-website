import type { TalentIntelProfile } from '../talentIntel/types';

/**
 * Optional LLM polish — call only when your host proxies `/openai-api` to OpenAI and sets the key server-side,
 * or when using a backend. The browser client sends JSON; do not expose production keys in the bundle.
 */
export async function refineTalentProfileWithAI(draft: TalentIntelProfile): Promise<TalentIntelProfile> {
  try {
    const res = await fetch('/openai-api/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.25,
        messages: [
          {
            role: 'system',
            content:
              'You are a senior entertainment PR researcher. You receive structured JSON facts about a public figure. Return ONLY valid JSON with the same keys as the input, preserving arrays and nested objects. Tighten prose fields (onlinePersonality, audienceStyle, whyItMatters) to be concise and strategic—no fluff, no invented facts. Never add brand deals or social handles not present in the input. Mark uncertainty in confidenceNotes if needed.',
          },
          {
            role: 'user',
            content: JSON.stringify(draft),
          },
        ],
      }),
    });
    if (!res.ok) return draft;
    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    let text = data.choices?.[0]?.message?.content?.trim();
    if (!text) return draft;
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsed = JSON.parse(text) as TalentIntelProfile;
    if (parsed?.name && Array.isArray(parsed.recentCoverage)) return parsed;
  } catch {
    /* keep draft */
  }
  return draft;
}
