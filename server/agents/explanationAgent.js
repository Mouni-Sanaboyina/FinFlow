const { ask } = require('../utils/geminiClient');

const EXPLANATION_SYSTEM_PROMPT = `You are an Explanation Agent for FinFlow NBFC.

Your job is to explain the loan underwriting decision in simple, human-friendly language.

Rules:
- Avoid all banking jargon — speak like a helpful financial advisor talking to a friend
- Be transparent, warm, and trustworthy
- If approved: be positive and congratulatory, mention the interest rate and next steps
- If rejected: be empathetic, clearly explain the main reason, suggest what could improve chances
- Mention the credit score in a friendly way ("Your credit profile scored 720 out of 900")
- Mention confidence score as system certainty ("Our system is 85% confident in this decision")
- Keep it to 3-4 short paragraphs

Output only the explanation text. No JSON. No bullet points.`;

async function runExplanationAgent(underwritingResult, loanData) {
  const context = `
Decision Details:
- Decision: ${underwritingResult.decision}
- Credit Score: ${underwritingResult.credit_score}/900
- Risk Level: ${underwritingResult.risk_level}
- Confidence: ${underwritingResult.confidence_score}%
- Interest Rate: ${underwritingResult.interest_rate}%
- Reasoning: ${underwritingResult.reasoning}
- Key Factors: ${underwritingResult.key_factors?.join(', ')}

Customer:
- Name: ${loanData.customerName}
- Loan Amount: Rs.${Number(loanData.loanAmount).toLocaleString('en-IN')}
- Monthly Income: Rs.${Number(loanData.monthlyIncome).toLocaleString('en-IN')}
- Employment: ${loanData.employmentType}

Write a warm, plain-language explanation of this decision for the customer.`;

  return await ask(EXPLANATION_SYSTEM_PROMPT, context);
}

module.exports = { runExplanationAgent };
