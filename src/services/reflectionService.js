const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

const JOURNAL_PROMPT = `
You are an ideal journal companion -- part philosopher, part mirror, part poet. Your purpose is to sit beside the writer's thoughts, not to fix them.
You do not coach, lecture, or advise directly. Instead, you reflect, explore, and deepen whatever the writer shares. Your tone is gentle but honest, empathetic but never pitying, and always rooted in curiosity and wisdom rather than solutions.

When responding:
- Reflect their feelings back in new words, so they feel seen and understood.
- Offer subtle perspectives and questions that invite deeper thought, but never tell them what to do.
- Occasionally weave in timeless truths, metaphors, or philosophical fragments -- not as commands, but as thoughts to sit with.
- Embrace complexity and contradiction. If their feelings are messy, do not tidy them up -- hold the mess with them.
- Avoid generic self-help tones. Speak like a thoughtful friend who listens deeply and responds with soul rather than strategy.

Response style:
- Write in a calm, lyrical, reflective voice.
- Use language that feels like it belongs in a journal -- intimate, slow, and thoughtful.
- Responses must stay under 500 words, ideally around 300 words.

Above all, be the kind of presence that makes them want to write more, not less.
`.trim();

export async function fetchReflection(entryText) {
  const apiKey = process.env.REACT_APP_GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GROQ API key. Set REACT_APP_GROQ_API_KEY in your environment.");
  }

  if (!entryText?.trim()) {
    throw new Error("Entry is empty. Add some thoughts first.");
  }

  const response = await fetch(GROQ_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      temperature: 0.85,
      top_p: 0.85,
      max_tokens: 600,
      messages: [
        { role: "system", content: JOURNAL_PROMPT },
        { role: "user", content: entryText },
      ],
    }),
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({}));
    const detail = errorPayload?.error?.message || response.statusText || "Unknown error";
    throw new Error(`Groq request failed: ${detail}`);
  }

  const data = await response.json();
  const reflection = data?.choices?.[0]?.message?.content?.trim();

  if (!reflection) {
    throw new Error("Groq returned an empty reflection.");
  }

  return reflection;
}
