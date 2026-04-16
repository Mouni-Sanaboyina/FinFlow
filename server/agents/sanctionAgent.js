const { ask } = require('../utils/geminiClient');

const SANCTION_SYSTEM_PROMPT = `You are a Sanction Letter Generator for FinFlow NBFC.

Generate a professional, formal Indian bank-style loan sanction letter.

Rules:
- Use formal banking language
- Generate a reference number like FL/2026/XXXXX (5 random digits)
- Include today's date
- Structure like a real Indian NBFC sanction letter
- Include processing fee, EMI, tenure clearly
- End with 4 terms & conditions

Output ONLY raw valid JSON — no markdown, no backticks, no text outside JSON:
{
  "reference_number": "FL/2026/XXXXX",
  "date": "DD Month YYYY",
  "letter_body": "Full formal letter with \\n for line breaks",
  "terms": ["term1", "term2", "term3", "term4"],
  "valid_until": "DD Month YYYY"
}`;

async function runSanctionAgent(loanData, underwritingResult) {
  const r = underwritingResult.interest_rate / 12 / 100;
  const n = loanData.tenure || 36;
  const emi = Math.round((loanData.loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));

  const context = `
Generate sanction letter for:
- Customer Name: ${loanData.customerName}
- PAN: ${loanData.pan}
- Loan Amount: Rs.${Number(loanData.loanAmount).toLocaleString('en-IN')}
- Interest Rate: ${underwritingResult.interest_rate}% per annum
- Tenure: ${n} months
- EMI: Rs.${emi.toLocaleString('en-IN')} per month
- Employment: ${loanData.employmentType}
- Monthly Income: Rs.${Number(loanData.monthlyIncome).toLocaleString('en-IN')}
- Credit Score: ${underwritingResult.credit_score}
- Processing Fee: Rs.${Math.round(loanData.loanAmount * 0.01).toLocaleString('en-IN')} (1%)
`;

  const rawText = await ask(SANCTION_SYSTEM_PROMPT, context);

  try {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    return JSON.parse(jsonMatch ? jsonMatch[0] : rawText);
  } catch {
    const ref = `FL/2026/${Math.floor(10000 + Math.random() * 90000)}`;
    const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    return {
      reference_number: ref,
      date: today,
      letter_body: `Dear ${loanData.customerName},\n\nWe are pleased to inform you that your loan application has been sanctioned.\n\nLoan Amount: Rs.${Number(loanData.loanAmount).toLocaleString('en-IN')}\nInterest Rate: ${underwritingResult.interest_rate}% p.a.\nTenure: ${n} months\nMonthly EMI: Rs.${emi.toLocaleString('en-IN')}\n\nKindly visit your nearest FinFlow branch within 30 days to complete documentation.\n\nWarm regards,\nCredit Department\nFinFlow NBFC`,
      terms: [
        'Loan disbursement within 3 working days of document submission',
        'EMI due on 5th of every month via NACH mandate',
        'Prepayment allowed after 6 months with 2% foreclosure charge',
        'Offer valid for 30 days from date of this letter',
      ],
      valid_until: validUntil,
    };
  }
}

module.exports = { runSanctionAgent };
