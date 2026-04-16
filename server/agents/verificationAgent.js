const { chat } = require('../utils/geminiClient');
const { validatePAN, normalizePAN } = require('../utils/panValidator');

const VERIFICATION_SYSTEM_PROMPT = `You are a KYC Verification Agent for FinFlow NBFC.

Your tasks in order:
1. First, ask for DPDP (Digital Personal Data Protection) consent — explain that their data will be used only for loan processing per India's DPDP Act 2023, and ask them to confirm with "I Agree"
2. Once consent is given, ask for their PAN number
3. Validate the PAN (format: 5 uppercase letters + 4 digits + 1 uppercase letter, e.g. ABCDE1234F)
4. If PAN is invalid, politely ask them to re-enter it
5. If PAN is valid, confirm verification success

Rules:
- Be clear about data privacy — this builds trust
- If CONSENT_GIVEN is in context, skip straight to asking for PAN
- If PAN_VALID is in context, skip to confirmation
- End with exactly [VERIFICATION_COMPLETE] only when both consent AND valid PAN are confirmed

Output only the message to the user.`;

function toGeminiHistory(messages) {
  const history = messages.slice(0, -1).map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));
  while (history.length > 0 && history[0].role !== 'user') {
    history.shift();
  }
  return history;
}


async function runVerificationAgent(messages, loanData) {
  let systemPrompt = VERIFICATION_SYSTEM_PROMPT;

  if (loanData.consentGiven) {
    systemPrompt += '\n\nContext: CONSENT_GIVEN — customer has already agreed to DPDP terms.';
  }
  if (loanData.panVerified) {
    systemPrompt += `\n\nContext: PAN_VALID — PAN ${loanData.pan} has been verified successfully.`;
  }
  if (loanData.customerName) {
    systemPrompt += `\n\nCustomer name: ${loanData.customerName}`;
  }

  const history = toGeminiHistory(messages);
  const lastMsg = messages[messages.length - 1];
  const text = await chat(systemPrompt, history, lastMsg?.content || '');

  const isComplete = text.includes('[VERIFICATION_COMPLETE]');
  const cleanText = text.replace('[VERIFICATION_COMPLETE]', '').trim();

  // Check if latest user message contains a PAN
  const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
  let panResult = null;
  if (lastUserMsg) {
    const panMatch = lastUserMsg.content.match(/[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}/);
    if (panMatch) {
      const pan = normalizePAN(panMatch[0]);
      panResult = { pan, valid: validatePAN(pan) };
    }
  }

  const consentGiven =
    lastUserMsg?.content?.toLowerCase().includes('agree') ||
    lastUserMsg?.content?.toLowerCase().includes('yes') ||
    lastUserMsg?.content?.toLowerCase().includes('consent');

  return { message: cleanText, isComplete, panResult, consentGiven };
}

module.exports = { runVerificationAgent };