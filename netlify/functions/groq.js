// netlify/functions/groq.js
const Groq = require("groq-sdk");

exports.handler = async function (event) {
  try {
    // Only accept POST
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const body = event.body ? JSON.parse(event.body) : {};
    const entryText = body.entryText;
    if (!entryText || !entryText.trim()) {
      return { statusCode: 400, body: JSON.stringify({ ok: false, error: "entryText required" }) };
    }

    // Compose the same payload you used on client
    const payload = {
      model: "llama-3.3-70b-versatile",
      temperature: 0.85,
      top_p: 0.85,
      max_tokens: 600,
      messages: [
        { role: "system", content: `You are an ideal journal companion -- part philosopher, part mirror, part poet. Your purpose is to sit beside the writer's thoughts, not to fix them.
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

Above all, be the kind of presence that makes them want to write more, not less.` },
        { role: "user", content: entryText }
      ]
    };

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, body: JSON.stringify({ ok: false, error: "Server misconfigured: missing GROQ_API_KEY" }) };
    }

    const groq = new Groq({ apiKey });

    // groq-sdk method to create chat completions depends on SDK — if you used fetch previously:
    const resp = await groq.createChatCompletion?.call?.(groq, payload)
      // fallback to fetch-style API if SDK exposes fetch:
      || await groq.fetch?.(payload);

    // Normalize response (try common shapes)
    const data = resp?.data ?? resp;
    const reflection = data?.choices?.[0]?.message?.content ?? data?.choices?.[0]?.text ?? null;

    if (!reflection) {
      return { statusCode: 502, body: JSON.stringify({ ok: false, error: "No reflection returned" }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, reflection: reflection.trim() }),
      headers: { "Content-Type": "application/json" },
    };
  } catch (err) {
    console.error("Groq proxy error:", err);
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: err.message }) };
  }
};
