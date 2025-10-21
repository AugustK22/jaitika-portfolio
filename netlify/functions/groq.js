// netlify/functions/groq.js
// Robust forwarder to Groq with helpful diagnostics
let fetchFn = global.fetch;
async function ensureFetch() {
  if (fetchFn) return fetchFn;
  // Try dynamic import of node-fetch v2 for CommonJS envs
  const mod = await import('node-fetch');
  fetchFn = mod.default || mod;
  return fetchFn;
}

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `You are an ideal journal companion -- part philosopher, part mirror, part poet. Your purpose is to sit beside the writer's thoughts, not to fix them.
You do not coach, lecture, or advise directly. Instead, you reflect, explore, and deepen whatever the writer shares. Your tone is gentle but honest, empathetic but never pitying, and always rooted in curiosity and wisdom rather than solutions.`.trim();

exports.handler = async function (event) {
  const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
  };

  try {
    if (event.httpMethod === "OPTIONS") {
      return { statusCode: 204, headers: CORS_HEADERS, body: "" };
    }

    if (event.httpMethod !== "POST") {
      return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ ok: false, error: "Method Not Allowed" }) };
    }

    // Parse body
    let body;
    try {
      body = event.body ? JSON.parse(event.body) : {};
    } catch (e) {
      return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ ok: false, error: "Invalid JSON body", detail: e.message }) };
    }

    const entryText = body.entryText;
    if (!entryText || !entryText.trim()) {
      return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ ok: false, error: "entryText required" }) };
    }

    const apiKey = process.env.GROQ_API_KEY;
    // Defensive checks and masked logging for debugging
    if (!apiKey) {
      console.error("GROQ_API_KEY missing in env");
      return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ ok: false, error: "Server misconfigured: missing GROQ_API_KEY" }) };
    }

    if (!GROQ_ENDPOINT || typeof GROQ_ENDPOINT !== "string" || !GROQ_ENDPOINT.startsWith("http")) {
      console.error("Invalid GROQ_ENDPOINT:", GROQ_ENDPOINT);
      return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ ok: false, error: "Server misconfigured: invalid GROQ_ENDPOINT", endpoint: GROQ_ENDPOINT }) };
    }

    // Build payload like the client did
    const payload = {
      model: "llama-3.3-70b-versatile",
      temperature: 0.85,
      top_p: 0.85,
      max_tokens: 600,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: entryText },
      ],
    };

    // Use fetch (native or node-fetch)
    const fetch = await ensureFetch();

    // Mask key display for logs
    const maskedKey = apiKey.length > 8 ? `${apiKey.slice(0,4)}...${apiKey.slice(-4)}` : "****";

    console.log("Forwarding to GROQ_ENDPOINT:", GROQ_ENDPOINT);
    console.log("Has GROQ_API_KEY:", !!apiKey, "masked:", maskedKey);
    console.log("Payload preview:", { model: payload.model, tokens: payload.max_tokens });

    const resp = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
      // Node-fetch v2 does not support 'timeout' in options; avoid using it here for portability
    });

    const text = await resp.text();
    let data;
    try { data = JSON.parse(text); } catch (e) { data = { ok: false, rawText: text }; }

    console.log("Groq status:", resp.status);

    if (!resp.ok) {
      console.error("Groq error body:", data);
      return { statusCode: resp.status, headers: CORS_HEADERS, body: JSON.stringify({ ok: false, status: resp.status, error: data }) };
    }

    // Success — return the whole Groq response as `data`
    return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify({ ok: true, data }) };

  } catch (err) {
    console.error("Function threw:", err && (err.stack || err.message || err));
    return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ ok: false, error: err.message || String(err) }) };
  }
};
