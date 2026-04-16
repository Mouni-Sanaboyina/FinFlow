import React, { useEffect, useRef, useState } from 'react';
import MessageBubble from './MessageBubble';
import { useChat } from '../hooks/useChat';
import { useLoan } from '../context/LoanContext';

const QUICK_REPLIES = {
  greeting: ['Get Started', 'Tell me more about loans'],
  verification: ['I Agree', 'What is DPDP?'],
};

export default function ChatWindow({ onShowSanction }) {
  const { messages, loading, started, initChat, send } = useChat();
  const { currentStep, currentAgent, sanctionData } = useLoan();
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { initChat(); }, []);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = () => {
    if (!input.trim()) return;
    send(input.trim());
    setInput('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const quickReplies = QUICK_REPLIES[currentAgent] || [];

  return (
    <div style={styles.container}>
      {/* Messages */}
      <div style={styles.messages}>
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}

        {/* Loading indicator */}
        {loading && (
          <div style={{ display: 'flex', gap: 6, padding: '4px 0 12px' }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                ...styles.dot,
                animationDelay: `${i * 0.15}s`,
              }} />
            ))}
          </div>
        )}

        {/* Sanction Letter Button */}
        {sanctionData && (
          <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0 16px' }}>
            <button style={styles.sanctionBtn} onClick={onShowSanction}>
              📄 View Sanction Letter
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick Replies */}
      {quickReplies.length > 0 && !loading && (
        <div style={styles.quickReplies}>
          {quickReplies.map(qr => (
            <button key={qr} style={styles.qrBtn} onClick={() => send(qr)}>
              {qr}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div style={styles.inputArea}>
        <textarea
          ref={inputRef}
          style={styles.textarea}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type your message..."
          rows={1}
          disabled={loading}
        />
        <button
          style={{ ...styles.sendBtn, opacity: (!input.trim() || loading) ? 0.4 : 1 }}
          onClick={handleSend}
          disabled={!input.trim() || loading}
        >
          ➤
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden',
  },
  messages: {
    flex: 1, overflowY: 'auto', padding: '20px 20px 8px',
    scrollbarWidth: 'thin', scrollbarColor: '#1e2f4a transparent',
  },
  dot: {
    width: 8, height: 8, borderRadius: '50%',
    background: '#C9A84C', opacity: 0.6,
    animation: 'bounce 0.8s ease-in-out infinite',
  },
  quickReplies: {
    display: 'flex', flexWrap: 'wrap', gap: 8,
    padding: '8px 20px 4px',
  },
  qrBtn: {
    padding: '6px 14px', borderRadius: 20, fontSize: 12, cursor: 'pointer',
    background: '#0d1f3c', border: '1px solid #2a4a8a', color: '#6a9fd8',
    transition: 'all 0.2s',
  },
  inputArea: {
    display: 'flex', alignItems: 'flex-end', gap: 10,
    padding: '12px 20px 16px',
    borderTop: '1px solid #1a2540',
    background: '#060d18',
  },
  textarea: {
    flex: 1, background: '#0d1520', border: '1px solid #1e3050',
    borderRadius: 12, padding: '10px 14px', color: '#e8f0fe', fontSize: 14,
    resize: 'none', outline: 'none', fontFamily: 'inherit', lineHeight: 1.5,
    minHeight: 44, maxHeight: 120,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 12, fontSize: 18, cursor: 'pointer',
    background: 'linear-gradient(135deg, #1a4a8a, #0f2d60)',
    border: '1px solid #2a5a9a', color: '#F5D07A',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.2s', flexShrink: 0,
  },
  sanctionBtn: {
    padding: '10px 24px', borderRadius: 10, fontSize: 14, cursor: 'pointer',
    background: 'linear-gradient(135deg, #8a6a00, #C9A84C)',
    border: 'none', color: '#000', fontWeight: 700,
    boxShadow: '0 4px 20px #C9A84C44',
    animation: 'pulse 2s ease-in-out infinite',
  },
};
