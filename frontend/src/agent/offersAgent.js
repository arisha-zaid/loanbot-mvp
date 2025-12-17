export function offersAgent({ risk, plan, esg, memory = {} }) {
  let adjustedRate = plan.rate;
  let processingFee = 5000;

  if (esg && esg.eligible) {
    adjustedRate -= esg.rateReduction || 0.5;
    processingFee = processingFee * (1 - (esg.feeReduction || 50) / 100);
  }

  if (risk && risk.classification === "LOW") {
    adjustedRate -= 0.25;
  }

  adjustedRate = Math.max(adjustedRate, 6.5);

  const monthlyRate = adjustedRate / 1200;
  const adjustedEMI = Math.round(
    (plan.amount * monthlyRate) /
    (1 - Math.pow(1 + monthlyRate, -plan.tenure))
  );

  const savingsFromESG = esg?.eligible ? 
    Math.round((plan.emi - adjustedEMI) * plan.tenure) : 0;

  let eligibilityStatus;
  if (!risk || risk.classification === "LOW") {
    eligibilityStatus = "Pre-Approved";
  } else if (risk.classification === "MEDIUM") {
    eligibilityStatus = "Conditionally Approved";
  } else {
    eligibilityStatus = "Under Review";
  }

  const summary = `
Loan Amount: ₹${plan.amount.toLocaleString("en-IN")}
Interest Rate: ${adjustedRate.toFixed(2)}% per annum
Tenure: ${plan.tenure} months
Monthly EMI: ₹${adjustedEMI.toLocaleString("en-IN")}
Processing Fee: ₹${processingFee.toLocaleString("en-IN")}
Status: ${eligibilityStatus}
${esg?.eligible ? `\nGreen Benefit Applied: ${esg.benefit}` : ""}
${savingsFromESG > 0 ? `Total Savings: ₹${savingsFromESG.toLocaleString("en-IN")}` : ""}
  `.trim();

  return {
    summary,
    plan: {
      ...plan,
      adjustedRate,
      adjustedEMI
    },
    risk,
    esg,
    processingFee,
    eligibilityStatus,
    savingsFromESG,
    offerId: `EY-${Date.now().toString(36).toUpperCase()}`
  };
}
