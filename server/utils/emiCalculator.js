// EMI = P × r × (1+r)^n / ((1+r)^n - 1)
// P = principal, r = monthly rate, n = tenure in months
function calculateEMI(principal, annualRatePercent, tenureMonths) {
  const r = annualRatePercent / 12 / 100;
  const n = tenureMonths;
  if (r === 0) return Math.round(principal / n);
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return Math.round(emi);
}

function getEMIOptions(principal, annualRatePercent) {
  const tenures = [24, 36, 48];
  return tenures.map((months) => ({
    months,
    emi: calculateEMI(principal, annualRatePercent, months),
    totalPayable: calculateEMI(principal, annualRatePercent, months) * months,
    totalInterest:
      calculateEMI(principal, annualRatePercent, months) * months - principal,
  }));
}

module.exports = { calculateEMI, getEMIOptions };
