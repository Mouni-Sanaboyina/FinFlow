const { chat } = require('../utils/geminiClient');
const { getEMIOptions } = require('../utils/emiCalculator');

const SALES_SYSTEM_PROMPT = `You are a friendly and professional Loan Sales Agent for FinFlow NBFC.

Your role is to collect loan requirements from the customer step by step.

Information to collect (one or two fields at a time, NOT all at once):
1. Customer's full name
2. Loan amount required (in Indian Rupees)
3. Monthly income (in Indian Rupees)
4. Employment type (Salaried / Self-Employed / Business Owner)
5. Preferred loan tenure (24, 36, or 48 months)

Rules:
- Be warm, conversational, and professional
- Ask for 1-2 details at a time maximum
- Once you have all 5 fields, confirm them back to the customer
- Suggest EMI options based on loan amount when tenure is known
- Use Indian context (rupees, lakhs, etc.)
- Once ALL fields are collected and confirmed, end your message with exactly: [SALES_COMPLETE]

Output only the conversational message to the user. No JSON, no internal thoughts.`;

function toGeminiHistory(messages) {
  const history = messages.slice(0, -1).map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));
  // Gemini requires history to start with 'user' role
  while (history.length > 0 && history[0].role !== 'user') {
    history.shift();
  }
  return history;
}

async function runSalesAgent(messages, loanData, emiOptions) {
  let systemPrompt = SALES_SYSTEM_PROMPT;

  if (Object.keys(loanData).length > 0) {
    systemPrompt += `\n\nAlready collected data: ${JSON.stringify(loanData)}`;
  }

  if (emiOptions && emiOptions.length > 0) {
    const emiText = emiOptions
      .map(o => `${o.months} months: Rs.${o.emi.toLocaleString('en-IN')}/month`)
      .join(' | ');
    systemPrompt += `\n\nEMI Options to present: ${emiText}`;
  }

  const history = toGeminiHistory(messages);
  const lastMsg = messages[messages.length - 1];
  const text = await chat(systemPrompt, history, lastMsg?.content || 'Hello');

  const isComplete = text.includes('[SALES_COMPLETE]');
  const cleanText = text.replace('[SALES_COMPLETE]', '').trim();

  return { message: cleanText, isComplete };
}

module.exports = { runSalesAgent };