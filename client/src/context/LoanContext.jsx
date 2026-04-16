import React, { createContext, useContext, useState } from 'react';

const LoanContext = createContext(null);

export function LoanProvider({ children }) {
  const [sessionId, setSessionId] = useState(null);
  const [currentStep, setCurrentStep] = useState('greeting');
  const [currentAgent, setCurrentAgent] = useState('sales');
  const [loanData, setLoanData] = useState({});
  const [underwritingResult, setUnderwritingResult] = useState(null);
  const [sanctionData, setSanctionData] = useState(null);

  const updateFromResponse = (res) => {
    if (res.sessionId) setSessionId(res.sessionId);
    if (res.currentStep) setCurrentStep(res.currentStep);
    if (res.currentAgent) setCurrentAgent(res.currentAgent);
    if (res.loanData) setLoanData(res.loanData);
    if (res.underwritingResult) setUnderwritingResult(res.underwritingResult);
    if (res.sanctionData) setSanctionData(res.sanctionData);
  };

  return (
    <LoanContext.Provider value={{
      sessionId, setSessionId,
      currentStep, currentAgent,
      loanData, underwritingResult, sanctionData,
      updateFromResponse,
    }}>
      {children}
    </LoanContext.Provider>
  );
}

export const useLoan = () => useContext(LoanContext);
