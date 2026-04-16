import React from 'react';
import { useLoan } from '../context/LoanContext';

const STEPS = [
  { key: 'greeting',     label: 'Welcome',      icon: '👋' },
  { key: 'sales',        label: 'Requirements', icon: '📋' },
  { key: 'verification', label: 'KYC',          icon: '🪪' },
  { key: 'underwriting', label: 'Underwriting', icon: '🧠' },
  { key: 'decision',     label: 'Decision',     icon: '⚖️' },
  { key: 'sanctioned',   label: 'Sanction',     icon: '📄' },
];

const STEP_ORDER = STEPS.map(s => s.key);

export default function LoanJourneyTracker() {
  const { currentStep } = useLoan();

  const currentIdx = STEP_ORDER.indexOf(currentStep) !== -1
    ? STEP_ORDER.indexOf(currentStep)
    : 0;

  return (
    <div style={styles.container}>
      <p style={styles.title}>Loan Journey</p>
      <div style={styles.track}>
        {STEPS.map((step, idx) => {
          const done   = idx < currentIdx;
          const active = idx === currentIdx;
          return (
            <div key={step.key} style={styles.stepRow}>
              {/* Left column: dot + connector line */}
              <div style={styles.dotCol}>
                <div style={{
                  ...styles.dot,
                  background: done ? '#C9A84C' : active ? '#F5D07A' : '#1e2a45',
                  border: active ? '2px solid #F5D07A' : done ? '2px solid #C9A84C' : '2px solid #2e3f60',
                  boxShadow: active ? '0 0 10px #F5D07A88' : 'none',
                  transform: active ? 'scale(1.1)' : 'scale(1)',
                }}>
                  <span style={{ fontSize: 12 }}>{step.icon}</span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div style={{
                    ...styles.line,
                    background: done ? '#C9A84C' : '#1e2a45',
                  }} />
                )}
              </div>

              {/* Right column: label */}
              <p style={{
                ...styles.label,
                color: active ? '#F5D07A' : done ? '#C9A84C' : '#4a5f80',
                fontWeight: active ? 600 : 400,
              }}>
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px 20px 16px',
    borderBottom: '1px solid #1a2540',
  },
  title: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#4a5f80',
    margin: '0 0 14px',
  },
  track: {
    display: 'flex',
    flexDirection: 'column',
  },
  stepRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
  },
  dotCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexShrink: 0,
  },
  dot: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    zIndex: 1,
    flexShrink: 0,
  },
  line: {
    width: 2,
    height: 18,
    transition: 'background 0.3s ease',
    borderRadius: 1,
  },
  label: {
    fontSize: 13,
    margin: 0,
    paddingTop: 6,
    transition: 'color 0.3s ease',
    lineHeight: 1.4,
  },
};
