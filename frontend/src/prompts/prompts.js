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
You are LoanBot’s voice assistant.
User command: "${command}"
Return JSON: { "action": "CONSULTANT|PLANNER|ECOLOAN|OFFERS", "text": "[Optional]" }
`;
