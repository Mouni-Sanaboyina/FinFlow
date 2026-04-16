import React from 'react';
import { useLoan } from '../context/LoanContext';

export default function LoanDataPanel() {
  const { loanData, underwritingResult, currentAgent } = useLoan();

  const hasData = Object.keys(loanData).some(k => loanData[k]);
  if (!hasData) return null;

  const fields = [
    { key: 'customerName',   label: 'Name',       icon: '👤' },
    { key: 'loanAmount',     label: 'Loan Amt',   icon: '💰', format: v => `₹${Number(v).toLocaleString('en-IN')}` },
    { key: 'monthlyIncome',  label: 'Income',     icon: '📈', format: v => `₹${Number(v).toLocaleString('en-IN')}/mo` },
    { key: 'employmentType', label: 'Employment', icon: '🏢' },
    { key: 'tenure',         label: 'Tenure',     icon: '📅', format: v => `${v} months` },
    { key: 'pan',            label: 'PAN',        icon: '🪪' },
    { key: 'panVerified',    label: 'KYC',        icon: '✅', format: v => v ? 'Verified' : 'Pending' },
    { key: 'consentGiven',   label: 'DPDP',       icon: '🔒', format: v => v ? 'Consented' : 'Pending' },
  ];

  return (
    <div style={styles.panel}>
      <p style={styles.title}>Application Data</p>
      <div style={styles.list}>
        {fields.map(({ key, label, icon, format }) => {
          const val = loanData[key];
          if (!val && val !== false) return null;
          const display = format ? format(val) : val;
          return (
            <div key={key} style={styles.row}>
              <span style={styles.icon}>{icon}</span>
              <div>
                <p style={styles.fieldLabel}>{label}</p>
                <p style={styles.fieldValue}>{String(display)}</p>
              </div>
            </div>
          );
        })}
      </div>

      {underwritingResult && (
        <div style={styles.uwBox}>
          <p style={styles.uwTitle}>Underwriting</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: '#4a5f80' }}>Credit Score</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: scoreColor(underwritingResult.credit_score) }}>
              {underwritingResult.credit_score}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: '#4a5f80' }}>Decision</span>
            <span style={{
              fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
              color: underwritingResult.decision === 'approved' ? '#2ECC71' : '#E74C3C',
            }}>
              {underwritingResult.decision}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, color: '#4a5f80' }}>Confidence</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#C9A84C' }}>
              {underwritingResult.confidence_score}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function scoreColor(score) {
  if (score >= 750) return '#2ECC71';
  if (score >= 650) return '#E6A817';
  return '#E74C3C';
}

const styles = {
  panel: {
    padding: '20px 16px',
    borderTop: '1px solid #1a2540',
  },
  title: {
    fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
    textTransform: 'uppercase', color: '#4a5f80', margin: '0 0 14px',
  },
  list: { display: 'flex', flexDirection: 'column', gap: 10 },
  row: { display: 'flex', alignItems: 'center', gap: 10 },
  icon: { fontSize: 16, width: 24, textAlign: 'center', flexShrink: 0 },
  fieldLabel: { margin: 0, fontSize: 10, color: '#4a5f80', textTransform: 'uppercase', letterSpacing: '0.05em' },
  fieldValue: { margin: '1px 0 0', fontSize: 13, color: '#c8d8f0', fontWeight: 500 },
  uwBox: {
    marginTop: 16, padding: 12,
    background: '#060f1e', border: '1px solid #1e2f4a', borderRadius: 8,
  },
  uwTitle: {
    margin: '0 0 10px', fontSize: 11, fontWeight: 600,
    letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C9A84C',
  },
};
