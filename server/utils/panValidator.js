// PAN format: 5 uppercase letters + 4 digits + 1 uppercase letter
// Example: ABCDE1234F
function validatePAN(pan) {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan?.trim().toUpperCase());
}

function normalizePAN(pan) {
  return pan?.trim().toUpperCase();
}

module.exports = { validatePAN, normalizePAN };
