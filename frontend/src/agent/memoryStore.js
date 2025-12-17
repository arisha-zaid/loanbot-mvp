const sessionMemory = {
  income: null,
  loanType: null,
  tenure: null,
  amount: null,
  conversationHistory: [],
  lastIntent: null,
  riskAssessment: null,
  esgEligible: null
};

export function updateMemory(entities) {
  if (!entities) return;
  
  if (entities.income !== null && entities.income !== undefined) {
    sessionMemory.income = entities.income;
  }
  if (entities.loanType !== null && entities.loanType !== undefined) {
    sessionMemory.loanType = entities.loanType;
  }
  if (entities.tenure !== null && entities.tenure !== undefined) {
    sessionMemory.tenure = entities.tenure;
  }
  if (entities.amount !== null && entities.amount !== undefined) {
    sessionMemory.amount = entities.amount;
  }
  if (entities.lastIntent) {
    sessionMemory.lastIntent = entities.lastIntent;
  }
  if (entities.riskAssessment) {
    sessionMemory.riskAssessment = entities.riskAssessment;
  }
  if (entities.esgEligible !== undefined) {
    sessionMemory.esgEligible = entities.esgEligible;
  }
}

export function getMemory() {
  return { ...sessionMemory };
}

export function addToHistory(role, message) {
  sessionMemory.conversationHistory.push({
    role,
    message,
    timestamp: Date.now()
  });
  
  if (sessionMemory.conversationHistory.length > 20) {
    sessionMemory.conversationHistory.shift();
  }
}

export function clearMemory() {
  sessionMemory.income = null;
  sessionMemory.loanType = null;
  sessionMemory.tenure = null;
  sessionMemory.amount = null;
  sessionMemory.conversationHistory = [];
  sessionMemory.lastIntent = null;
  sessionMemory.riskAssessment = null;
  sessionMemory.esgEligible = null;
}

export function getMissingFields() {
  const missing = [];
  if (!sessionMemory.income) missing.push("income");
  if (!sessionMemory.loanType) missing.push("loanType");
  if (!sessionMemory.tenure) missing.push("tenure");
  if (!sessionMemory.amount) missing.push("amount");
  return missing;
}

export function isReadyForOffer() {
  return (
    sessionMemory.income !== null &&
    sessionMemory.amount !== null &&
    sessionMemory.tenure !== null
  );
}
