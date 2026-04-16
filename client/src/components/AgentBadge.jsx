import React from 'react';

const AGENT_CONFIG = {
  sales:        { label: 'Sales Agent',        color: '#4A90D9', bg: '#0d1f3c', icon: '💼' },
  verification: { label: 'Verification Agent', color: '#27AE85', bg: '#0a2318', icon: '🪪' },
  underwriting: { label: 'Underwriting Agent', color: '#E6A817', bg: '#2a1e05', icon: '🧠' },
  explanation:  { label: 'Explanation Agent',  color: '#9B59B6', bg: '#1e0d2e', icon: '💡' },
  sanction:     { label: 'Sanction Agent',     color: '#C9A84C', bg: '#2a2005', icon: '📄' },
  complete:     { label: 'Journey Complete',   color: '#2ECC71', bg: '#0a2318', icon: '✅' },
  rejected:     { label: 'Application Closed', color: '#E74C3C', bg: '#2a0a0a', icon: '❌' },
  error:        { label: 'System',             color: '#95A5A6', bg: '#1a1a1a', icon: '⚙️' },
};

export default function AgentBadge({ agent }) {
  const config = AGENT_CONFIG[agent] || AGENT_CONFIG.sales;
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '3px 10px',
      borderRadius: 20,
      background: config.bg,
      border: `1px solid ${config.color}33`,
      marginBottom: 6,
    }}>
      <span style={{ fontSize: 12 }}>{config.icon}</span>
      <span style={{ fontSize: 10, fontWeight: 600, color: config.color, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        {config.label}
      </span>
    </div>
  );
}
