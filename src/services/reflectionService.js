const NETLIFY_FN = "https://subtle-florentine-617632.netlify.app/.netlify/functions/groq";

export async function fetchReflection(entryText) {
  if (!entryText?.trim()) throw new Error("Entry is empty. Add some thoughts first.");

  const res = await fetch(NETLIFY_FN, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entryText }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || `Proxy failed: ${res.status} ${res.statusText}`);
  }

  const payload = await res.json();
  if (!payload?.ok) throw new Error(payload?.error || "Unknown proxy error");
  // payload.data contains the raw Groq response (choices etc). If you used earlier shape:
  const reflection = payload?.data?.choices?.[0]?.message?.content || payload?.data?.choices?.[0]?.text || payload?.reflection;
  return (reflection || "").trim();
}
