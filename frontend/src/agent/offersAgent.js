export function offersAgent({ risk, plan, esg }) {
  return {
    summary: `
Based on your profile, you are eligible for a ₹50L loan.

• EMI: ₹${plan.emi}
• Interest Rate: ${plan.rate}%
• Tenure: ${plan.tenure} months
${esg.eligible ? "• ESG Benefit Applied" : ""}
`,
    plan,
    risk,
    esg
  };
}
