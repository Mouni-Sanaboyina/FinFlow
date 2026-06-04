const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  baseURL: process.env.AZURE_OPENAI_ENDPOINT,
});

async function ask(systemPrompt, userContent) {
  try {
    const response = await client.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("===== OPENAI ERROR =====");
    console.error(error);
    throw error;
  }
}

async function chat(systemPrompt, history, latestUserMessage) {
  try {
    const convertedHistory = history.map((m) => ({
      role: m.role === "model" ? "assistant" : "user",
      content: m.parts?.[0]?.text ?? m.content ?? "",
    }));

    const messages = [
      { role: "system", content: systemPrompt },
      ...convertedHistory,
      { role: "user", content: latestUserMessage }
    ];

    const response = await client.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
      messages,
      temperature: 0.7,
      max_tokens: 1000
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("===== OPENAI ERROR =====");
    console.error(error);
    throw error;
  }
}

module.exports = { ask, chat };