const JOURNAL_PROMPT = `...`; // keep or remove — server will use its own system message

export async function fetchReflection(entryText) {
  if (!entryText?.trim()) throw new Error("Entry is empty. Add some thoughts first.");

  const res = await fetch("/.netlify/functions/groq", { // if Vercel, use "/api/groq"
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entryText })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || `Proxy request failed: ${res.status} ${res.statusText}`);
  }

  const payload = await res.json();
  if (!payload?.ok) throw new Error(payload?.error || "Unknown proxy error");
  return payload.reflection;
}
