import React from 'react';
import ReactMarkdown from 'react-markdown';
import AgentBadge from './AgentBadge';

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <div style={styles.userBubble}>
          <p style={styles.userText}>{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}>
      <div style={{ maxWidth: '80%' }}>
        {message.agent && <AgentBadge agent={message.agent} />}
        <div style={styles.assistantBubble}>
          <ReactMarkdown
            components={{
              p: ({ children }) => <p style={styles.mdP}>{children}</p>,
              strong: ({ children }) => <strong style={styles.mdStrong}>{children}</strong>,
              ul: ({ children }) => <ul style={styles.mdUl}>{children}</ul>,
              li: ({ children }) => <li style={styles.mdLi}>{children}</li>,
              h3: ({ children }) => <h3 style={styles.mdH3}>{children}</h3>,
            }}
          >
            {message.content}
          </ReactMarkdown>

          {/* Underwriting Result Card */}
          {message.underwritingResult && (
            <UnderwritingCard result={message.underwritingResult} />
          )}
        </div>
      </div>
    </div>
  );
}

function UnderwritingCard({ result }) {
  const isApproved = result.decision === 'approved';
  const scoreColor = result.credit_score >= 750 ? '#2ECC71' : result.credit_score >= 650 ? '#E6A817' : '#E74C3C';
  const scorePercent = ((result.credit_score - 300) / 600) * 100;

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <span style={{ fontSize: 18 }}>{isApproved ? '✅' : '❌'}</span>
        <div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: isApproved ? '#2ECC71' : '#E74C3C' }}>
            {isApproved ? 'LOAN APPROVED' : 'LOAN REJECTED'}
          </p>
          <p style={{ margin: 0, fontSize: 11, color: '#4a5f80' }}>
            Confidence: {result.confidence_score}%
          </p>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <p style={{ margin: 0, fontSize: 11, color: '#4a5f80' }}>Risk Level</p>
          <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: riskColor(result.risk_level), textTransform: 'capitalize' }}>
            {result.risk_level}
          </p>
        </div>
      </div>

      {/* Credit Score Bar */}
      <div style={{ marginTop: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: '#4a5f80' }}>Credit Score</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: scoreColor }}>{result.credit_score} / 900</span>
        </div>
        <div style={styles.scoreTrack}>
          <div style={{ ...styles.scoreBar, width: `${scorePercent}%`, background: scoreColor }} />
        </div>
      </div>

      {/* Confidence Score Bar */}
      <div style={{ marginTop: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: '#4a5f80' }}>Decision Confidence</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#C9A84C' }}>{result.confidence_score}%</span>
        </div>
        <div style={styles.scoreTrack}>
          <div style={{ ...styles.scoreBar, width: `${result.confidence_score}%`, background: '#C9A84C' }} />
        </div>
      </div>

      {/* Key Factors */}
      {result.key_factors && (
        <div style={{ marginTop: 12 }}>
          <p style={{ margin: '0 0 6px', fontSize: 11, color: '#4a5f80', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Key Factors</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {result.key_factors.map((f, i) => (
              <span key={i} style={styles.factor}>{f}</span>
            ))}
          </div>
        </div>
      )}

      {isApproved && (
        <div style={{ marginTop: 10, padding: '6px 10px', background: '#0a1f10', borderRadius: 6, border: '1px solid #1a4a2a' }}>
          <p style={{ margin: 0, fontSize: 12, color: '#2ECC71' }}>
            📊 Interest Rate: <strong>{result.interest_rate}% p.a.</strong>
          </p>
        </div>
      )}
    </div>
  );
}

function riskColor(level) {
  return level === 'low' ? '#2ECC71' : level === 'medium' ? '#E6A817' : '#E74C3C';
}

const styles = {
  userBubble: {
    background: 'linear-gradient(135deg, #1a3a6e, #0f2347)',
    border: '1px solid #2a4a8a',
    borderRadius: '18px 18px 4px 18px',
    padding: '12px 16px',
    maxWidth: 320,
  },
  userText: {
    margin: 0,
    fontSize: 14,
    color: '#e8f0fe',
    lineHeight: 1.5,
  },
  assistantBubble: {
    background: '#0d1520',
    border: '1px solid #1a2540',
    borderRadius: '4px 18px 18px 18px',
    padding: '14px 18px',
  },
  mdP: { margin: '0 0 8px', fontSize: 14, color: '#c8d8f0', lineHeight: 1.7 },
  mdStrong: { color: '#F5D07A', fontWeight: 600 },
  mdUl: { margin: '4px 0 8px', paddingLeft: 20 },
  mdLi: { fontSize: 14, color: '#c8d8f0', lineHeight: 1.7, marginBottom: 4 },
  mdH3: { margin: '0 0 8px', fontSize: 15, color: '#F5D07A', fontWeight: 600 },
  card: {
    marginTop: 14,
    padding: 14,
    background: '#060f1e',
    border: '1px solid #1e2f4a',
    borderRadius: 10,
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  scoreTrack: {
    height: 6,
    background: '#1a2540',
    borderRadius: 3,
    overflow: 'hidden',
  },
  scoreBar: {
    height: '100%',
    borderRadius: 3,
    transition: 'width 1s ease',
  },
  factor: {
    fontSize: 10,
    padding: '3px 8px',
    background: '#0d1f3c',
    border: '1px solid #1e3a6a',
    borderRadius: 12,
    color: '#6a9fd8',
  },
};
