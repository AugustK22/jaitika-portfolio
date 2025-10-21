// netlify/functions/groq.js
const Groq = require("groq-sdk");

exports.handler = async function (event) {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const body = event.body ? JSON.parse(event.body) : {};
    const query = body.query || "default query here";

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const data = await groq.fetch(query);

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, data }),
      headers: { "Content-Type": "application/json" },
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: err.message }),
    };
  }
};
