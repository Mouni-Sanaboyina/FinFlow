import React, { useState } from 'react';
import { LoanProvider } from './context/LoanContext';
import LoanJourneyTracker from './components/LoanJourneyTracker';
import LoanDataPanel from './components/LoanDataPanel';
import ChatWindow from './components/ChatWindow';
import SanctionLetterModal from './components/SanctionLetterModal';
import './App.css';

function AppInner() {
  const [showSanction, setShowSanction] = useState(false);

  return (
    <div className="app-shell">
      {/* Left Sidebar */}
      <aside className="sidebar">
        {/* Logo */}
        <div className="logo-area">
          <div className="logo-mark">FF</div>
          <div>
            <p className="logo-name">FinFlow</p>
            <p className="logo-tag">Loan Assistant</p>
          </div>
        </div>

        {/* Journey Tracker */}
        <LoanJourneyTracker />

        {/* Loan Data Panel */}
        <LoanDataPanel />

        {/* Footer */}
        <div className="sidebar-footer">
          <p>Powered by Claude AI</p>
          <p>Cognizant Technoverse 2026</p>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="main-area">
        {/* Top Bar */}
        <div className="topbar">
          <div>
            <h1 className="topbar-title">AI Loan Sales Assistant</h1>
            <p className="topbar-sub">Multi-agent system — Banking · Lending & Credit</p>
          </div>
          <div className="topbar-badge">
            <span className="live-dot" />
            Live
          </div>
        </div>

        {/* Chat */}
        <ChatWindow onShowSanction={() => setShowSanction(true)} />
      </main>

      {/* Sanction Modal */}
      {showSanction && <SanctionLetterModal onClose={() => setShowSanction(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <LoanProvider>
      <AppInner />
    </LoanProvider>
  );
}
