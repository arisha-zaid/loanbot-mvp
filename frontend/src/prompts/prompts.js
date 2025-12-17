export const consultantPrompt = (statement) => `
You are a professional credit analyst at EY.
Audit the following bank statement text.
Identify financial risks, missing documents, unusual transactions, or irregular patterns.
Return flags as JSON array:
[{"id":1,"text":"High cash withdrawals","status":"amber"}]
Bank Statement:
${statement}
`;

export const plannerPrompt = (principal, rate, months, extraEMI) => `
You are a financial advisor.
Loan principal: ₹${principal}, rate: ${rate*100}%, tenure: ${months} months, extra EMI: ₹${extraEMI}.
Calculate interest saved and give 1-2 sentences advice.
`;

export const ecoloanPrompt = (green, fee) => `
You are a sustainable finance consultant.
User selected green: ${green}, standard fee: ₹${fee}.
If yes, show reduction (50%) and message.
`;

export const offersPrompt = (riskScore, emi, green, tenure, rate, fee) => `
You are a senior EY loan officer.
Risk score: ${riskScore}, EMI: ₹${emi}, Green: ${green}, Tenure: ${tenure}, Interest Rate: ${rate*100}%, Fee: ₹${fee}.
Generate professional loan offer in ≤50 words.
`;

export const voicePrompt = (command) => `
You are LoanBot's voice assistant.
User command: "${command}"
Return JSON: { "action": "CONSULTANT|PLANNER|ECOLOAN|OFFERS", "text": "[Optional]" }
`;

export const intentExtractionPrompt = (userMessage) => `
You are an intent classification system for EY FlowBot, a professional banking loan assistant.

Analyze the user's message and extract:
1. The primary intent
2. Any loan-related entities mentioned

INTENTS (choose exactly ONE):
- PLANNER: User wants to plan loan repayment, calculate EMI, understand loan terms, or schedule payments
- RISK: User asks about eligibility, credit score, risk assessment, or affordability
- OFFERS: User wants to see loan offers, rates, compare products, or finalize a loan
- ESG: User mentions green loans, sustainability, solar, eco-friendly, or environmental benefits
- CONSULTANT: User wants document review, statement analysis, or general banking advice

ENTITIES to extract (use null if not mentioned):
- income: Monthly income in INR (number only, no currency symbols)
- loanType: Type of loan (home, car, personal, business, education)
- tenure: Loan duration in months (number only)
- amount: Loan amount in INR (number only, no currency symbols)

User message: "${userMessage}"

Respond ONLY with valid JSON, no explanation:
{
  "intent": "PLANNER|RISK|OFFERS|ESG|CONSULTANT",
  "confidence": 0.0-1.0,
  "entities": {
    "income": null,
    "loanType": null,
    "tenure": null,
    "amount": null
  }
}
`;
