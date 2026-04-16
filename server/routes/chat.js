const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getSession, updateSession, addMessage } = require('../middleware/sessionStore');
const { runMasterAgent } = require('../agents/masterAgent');

// POST /api/chat - main conversation endpoint
router.post('/', async (req, res) => {
  try {
    const { message, sessionId: clientSessionId } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Create or retrieve session
    const sessionId = clientSessionId || uuidv4();
    const session = getSession(sessionId);

    // Add user message to history
    addMessage(sessionId, 'user', message);

    // Run master orchestrator
    const result = await runMasterAgent(
      { ...session, messages: getSession(sessionId).messages },
      message
    );

    // Save assistant response to history
    addMessage(sessionId, 'assistant', result.message);

    // Update session state
    updateSession(sessionId, {
      currentAgent: result.currentAgent,
      currentStep: result.currentStep,
      loanData: result.loanData,
      underwritingResult: result.underwritingResult,
      sanctionData: result.sanctionData,
    });

    return res.json({
      sessionId,
      message: result.message,
      currentAgent: result.currentAgent,
      currentStep: result.currentStep,
      loanData: result.loanData,
      underwritingResult: result.underwritingResult,
      sanctionData: result.sanctionData,
      stepCompleted: result.stepCompleted,
    });
  } catch (err) {
    console.error('Chat error:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// POST /api/chat/start - initialize a new session with greeting
router.post('/start', async (req, res) => {
  try {
    const sessionId = uuidv4();
    getSession(sessionId); // initialize

    const greeting = `Namaste! 🙏 Welcome to **FinFlow NBFC** — your trusted lending partner.\n\nI'm your AI Loan Assistant, here to help you through a quick and easy loan application. Our process is fully digital, transparent, and takes just a few minutes.\n\nMay I know your name to get started?`;

    addMessage(sessionId, 'assistant', greeting);

    return res.json({
      sessionId,
      message: greeting,
      currentAgent: 'sales',
      currentStep: 'greeting',
      loanData: {},
    });
  } catch (err) {
    console.error('Start error:', err);
    return res.status(500).json({ error: 'Failed to start session' });
  }
});

// GET /api/chat/session/:sessionId - get session state
router.get('/session/:sessionId', (req, res) => {
  const session = getSession(req.params.sessionId);
  return res.json(session);
});

module.exports = router;
