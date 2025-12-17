export function plannerAgent(userMessage, memory = {}) {
  const amount = memory.amount || 5000000;
  const rate = memory.loanType === "home" ? 8.5 : 
               memory.loanType === "car" ? 9.5 :
               memory.loanType === "personal" ? 12.0 :
               memory.loanType === "business" ? 11.5 :
               memory.loanType === "education" ? 8.0 : 10.9;
  
  const tenure = memory.tenure || 60;
  
  const monthlyRate = rate / 1200;
  const emi = Math.round(
    (amount * monthlyRate) /
    (1 - Math.pow(1 + monthlyRate, -tenure))
  );
  
  const totalPayment = emi * tenure;
  const totalInterest = totalPayment - amount;
  
  let advice = "";
  if (memory.income) {
    const emiRatio = emi / memory.income;
    if (emiRatio < 0.3) {
      advice = "Your EMI is well within comfortable limits, representing less than 30% of your income.";
    } else if (emiRatio < 0.5) {
      advice = "This EMI is manageable but represents a significant portion of your income. Consider a longer tenure if flexibility is preferred.";
    } else {
      advice = "We recommend exploring a longer tenure or lower amount to ensure comfortable repayment.";
    }
  }

  return {
    amount,
    rate,
    tenure,
    emi,
    totalPayment,
    totalInterest,
    advice,
    loanType: memory.loanType || "standard"
  };
}
