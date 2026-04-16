import { useState, useCallback } from 'react';
import { startSession, sendMessage } from '../services/api';
import { useLoan } from '../context/LoanContext';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const { sessionId, setSessionId, updateFromResponse } = useLoan();

  const initChat = useCallback(async () => {
    if (started) return;
    setLoading(true);
    try {
      const { data } = await startSession();
      setSessionId(data.sessionId);
      updateFromResponse(data);
      setMessages([{ role: 'assistant', content: data.message, agent: 'sales' }]);
      setStarted(true);
    } catch (err) {
      console.error('Failed to start session:', err);
    } finally {
      setLoading(false);
    }
  }, [started]);

  const send = useCallback(async (text) => {
    if (!text.trim() || loading) return;

    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const { data } = await sendMessage(sessionId, text);
      updateFromResponse(data);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: data.message,
          agent: data.currentAgent,
          stepCompleted: data.stepCompleted,
          underwritingResult: data.underwritingResult,
        },
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: '⚠️ Something went wrong. Please try again.', agent: 'error' },
      ]);
    } finally {
      setLoading(false);
    }
  }, [sessionId, loading]);

  return { messages, loading, started, initChat, send };
}
