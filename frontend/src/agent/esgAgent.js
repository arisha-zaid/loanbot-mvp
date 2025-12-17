export function esgAgent(userMessage, memory = {}) {
  const lowerMessage = (userMessage || "").toLowerCase();
  const loanType = (memory.loanType || "").toLowerCase();

  const greenKeywords = [
    "solar",
    "electric",
    "ev",
    "green",
    "sustainable",
    "eco",
    "environment",
    "renewable",
    "energy efficient",
    "hybrid",
    "carbon",
    "clean energy"
  ];

  const isGreen = greenKeywords.some(
    keyword => lowerMessage.includes(keyword) || loanType.includes(keyword)
  );

  if (isGreen) {
    return {
      eligible: true,
      benefit: "0.5% interest rate reduction applied",
      rateReduction: 0.5,
      feeReduction: 50,
      category: determineGreenCategory(lowerMessage),
      environmentalImpact: "Your investment contributes to sustainable development goals."
    };
  }

  return {
    eligible: false,
    benefit: null,
    rateReduction: 0,
    feeReduction: 0,
    category: null,
    environmentalImpact: null
  };
}

function determineGreenCategory(message) {
  if (message.includes("solar")) return "Solar Energy";
  if (message.includes("electric") || message.includes("ev")) return "Electric Vehicle";
  if (message.includes("hybrid")) return "Hybrid Vehicle";
  if (message.includes("energy efficient")) return "Energy Efficiency";
  return "Green Investment";
}
