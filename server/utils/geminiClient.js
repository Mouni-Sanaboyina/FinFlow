const OpenAI = require('openai');

const client = new OpenAI({
  apiKey: process.env.BYTEZ_API_KEY,
  baseURL: 'https://api.bytez.com/models/v2/openai/v1',
  defaultHeaders: {
    'Authorization': `Key ${process.env.BYTEZ_API_KEY}`,
  },
});

// Smaller model = faster cold start
const MODEL = 'Qwen/Qwen2.5-3B-Instruct'; // A capable model available on Bytez

// Simple single-turn call: system prompt + user content → text response
async function ask(systemPrompt, userContent) {
  const response = await client.chat.completions.create({
    model: MODEL,
    max_tokens: 1000,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent },
    ],
  });
  return response.choices[0].message.content.trim();
}

// Multi-turn call with full conversation history
// history = [{role:'user'|'model', parts:[{text:'...'}]}]  (Gemini format — we convert it)
async function chat(systemPrompt, history, latestUserMessage) {
  // Convert from Gemini format ({role:'model', parts:[{text:'...'}]})
  // to OpenAI format ({role:'assistant', content:'...'})
  const convertedHistory = history.map(m => ({
    role: m.role === 'model' ? 'assistant' : 'user',
    content: m.parts?.[0]?.text ?? m.content ?? '',
  }));

  const messages = [
    { role: 'system', content: systemPrompt },
    ...convertedHistory,
    { role: 'user', content: latestUserMessage },
  ];

  const response = await client.chat.completions.create({
    model: MODEL,
    max_tokens: 1000,
    messages,
  });
  return response.choices[0].message.content.trim();
}

module.exports = { ask, chat };