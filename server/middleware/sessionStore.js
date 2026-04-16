// In-memory session store for loan journey state
const sessions = new Map();

function getSession(sessionId) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      sessionId,
      currentAgent: 'sales',
      currentStep: 'greeting',
      loanData: {},
      messages: [],
      createdAt: new Date().toISOString(),
    });
  }
  return sessions.get(sessionId);
}

function updateSession(sessionId, updates) {
  const session = getSession(sessionId);
  const updated = { ...session, ...updates };
  sessions.set(sessionId, updated);
  return updated;
}

function addMessage(sessionId, role, content) {
  const session = getSession(sessionId);
  session.messages.push({ role, content });
  sessions.set(sessionId, session);
}

module.exports = { getSession, updateSession, addMessage };
