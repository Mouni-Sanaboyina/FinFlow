const { ask } = require('../utils/geminiClient');
const { runSalesAgent } = require('./salesAgent');
const { runVerificationAgent } = require('./verificationAgent');
const { runUnderwritingAgent } = require('./underwritingAgent');
const { runExplanationAgent } = require('./explanationAgent');
const { runSanctionAgent } = require('./sanctionAgent');
const { getEMIOptions } = require('../utils/emiCalculator');

const EXTRACT_SYSTEM_PROMPT = `Extract loan application data from the conversation.
Return ONLY raw valid JSON with these fields (null if not mentioned):
{
  "customerName": null,
  "loanAmount": null,
  "monthlyIncome": null,
  "employmentType": null,
  "tenure": null
}
Numbers must be plain integers (no commas, no currency symbols).
employmentType must be one of: Salaried, Self-Employed, Business Owner`;

async function extractLoanData(messages, existingData) {
  const conversationText = messages
    .map(m => `${m.role === 'user' ? 'Customer' : 'Agent'}: ${m.content}`)
    .join('\n');

  try {
    const raw = await ask(EXTRACT_SYSTEM_PROMPT, conversationText);
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    const extracted = JSON.parse(jsonMatch ? jsonMatch[0] : raw);

    const merged = { ...existingData };
    for (const [key, val] of Object.entries(extracted)) {
      if (val !== null && val !== undefined && val !== '') {
        merged[key] = val;
      }
    }
    return merged;
  } catch {
    return existingData;
  }
}

function allSalesDataCollected(data) {
  return !!(data.customerName && data.loanAmount && data.monthlyIncome && data.employmentType && data.tenure);
}

async function runMasterAgent(session, userMessage) {
  const { messages, loanData, currentAgent } = session;

  let responseData = {
    message: '',
    currentAgent,
    currentStep: session.currentStep,
    loanData: { ...loanData },
    underwritingResult: session.underwritingResult || null,
    sanctionData: session.sanctionData || null,
    stepCompleted: null,
  };

  // ── SALES ──────────────────────────────────────────────────────────────────
  if (currentAgent === 'sales') {
    const updatedLoanData = await extractLoanData(messages, loanData);
    responseData.loanData = updatedLoanData;

    let emiOptions = null;
    if (updatedLoanData.loanAmount && updatedLoanData.tenure) {
      emiOptions = getEMIOptions(Number(updatedLoanData.loanAmount), 13.5);
    }

    const { message, isComplete } = await runSalesAgent(messages, updatedLoanData, emiOptions);
    responseData.message = message;

    if (isComplete || allSalesDataCollected(updatedLoanData)) {
      responseData.currentAgent = 'verification';
      responseData.currentStep = 'verification';
      responseData.stepCompleted = 'sales';
    }
  }

  // ── VERIFICATION ───────────────────────────────────────────────────────────
  else if (currentAgent === 'verification') {
    const { message, isComplete, panResult, consentGiven } = await runVerificationAgent(messages, loanData);
    responseData.message = message;

    if (consentGiven && !loanData.consentGiven) responseData.loanData.consentGiven = true;
    if (panResult?.valid) {
      responseData.loanData.pan = panResult.pan;
      responseData.loanData.panVerified = true;
    }

    if (isComplete || (responseData.loanData.consentGiven && responseData.loanData.panVerified)) {
      responseData.currentAgent = 'underwriting';
      responseData.currentStep = 'underwriting';
      responseData.stepCompleted = 'verification';
    }
  }

  // ── UNDERWRITING ───────────────────────────────────────────────────────────
  else if (currentAgent === 'underwriting') {
    const underwritingResult = await runUnderwritingAgent(loanData);
    const explanation = await runExplanationAgent(underwritingResult, loanData);

    responseData.underwritingResult = underwritingResult;
    responseData.message = explanation;
    responseData.currentStep = 'decision';
    responseData.stepCompleted = 'underwriting';
    responseData.currentAgent = underwritingResult.decision === 'approved' ? 'sanction' : 'rejected';
    if (underwritingResult.decision !== 'approved') responseData.currentStep = 'rejected';
  }

  // ── SANCTION ───────────────────────────────────────────────────────────────
  else if (currentAgent === 'sanction') {
    const sanctionData = await runSanctionAgent(loanData, session.underwritingResult);
    responseData.sanctionData = sanctionData;
    responseData.message = `Congratulations, ${loanData.customerName}! Your loan sanction letter has been generated. Reference: **${sanctionData.reference_number}**\n\nThis offer is valid until **${sanctionData.valid_until}**. Please visit your nearest FinFlow branch within 30 days to complete documentation. Is there anything else I can help you with?`;
    responseData.currentStep = 'sanctioned';
    responseData.stepCompleted = 'sanction';
    responseData.currentAgent = 'complete';
  }

  // ── COMPLETE / REJECTED ────────────────────────────────────────────────────
  else {
    const status = currentAgent === 'complete' ? 'approved and sanctioned' : 'closed after rejection';
    const wrapPrompt = `You are a helpful loan assistant for FinFlow NBFC. The loan journey is ${status}. Answer follow-up questions briefly and professionally. Keep responses under 3 sentences.`;
    const conversationText = messages.map(m => `${m.role === 'user' ? 'Customer' : 'Agent'}: ${m.content}`).join('\n');
    responseData.message = await ask(wrapPrompt, conversationText + `\nCustomer: ${userMessage}`);
  }

  return responseData;
}

module.exports = { runMasterAgent };
