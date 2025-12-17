export function riskAgent(userMessage, memory = {}) {
  let score = 720;
  let classification = "LOW";
  const flags = [];

  if (memory.income) {
    if (memory.income >= 100000) {
      score += 30;
    } else if (memory.income >= 50000) {
      score += 15;
    } else if (memory.income < 25000) {
      score -= 20;
      flags.push("Income below preferred threshold");
    }
  }

  let emiRatio = 0.32;
  if (memory.income && memory.amount && memory.tenure) {
    const rate = 10.9 / 1200;
    const emi = (memory.amount * rate) / (1 - Math.pow(1 + rate, -memory.tenure));
    emiRatio = emi / memory.income;
    
    if (emiRatio > 0.5) {
      score -= 40;
      flags.push("High EMI-to-income ratio");
    } else if (emiRatio > 0.4) {
      score -= 20;
      flags.push("Elevated EMI-to-income ratio");
    }
  }

  if (memory.amount) {
    if (memory.amount > 10000000) {
      score -= 10;
      flags.push("High loan amount requested");
    }
  }

  score = Math.max(300, Math.min(900, score));

  if (score >= 750) {
    classification = "LOW";
  } else if (score >= 650) {
    classification = "MEDIUM";
  } else {
    classification = "HIGH";
  }

  return {
    riskScore: score,
    emiRatio: Math.min(emiRatio, 1),
    classification,
    flags,
    eligible: classification !== "HIGH"
  };
}
