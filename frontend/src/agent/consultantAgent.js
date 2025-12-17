export function consultantAgent(userMessage, memory = {}) {
  const lowerMessage = userMessage.toLowerCase();
  
  let response = "";
  let flags = [];

  if (lowerMessage.includes("statement") || lowerMessage.includes("document")) {
    response = "I can assist with reviewing your bank statements and financial documents. Please share the relevant documents for a comprehensive analysis.";
    flags = [];
  } else if (lowerMessage.includes("eligib") || lowerMessage.includes("qualify")) {
    response = "To assess your loan eligibility, we consider factors including income stability, credit history, and existing obligations.";
    if (memory.income) {
      response += ` Based on your declared income of ₹${memory.income.toLocaleString("en-IN")}, you appear to meet our initial criteria.`;
    }
  } else if (lowerMessage.includes("rate") || lowerMessage.includes("interest")) {
    response = "Our interest rates are competitive and tailored to your profile. Home loans start at 8.5%, personal loans at 10.5%, and business loans at 12%.";
  } else if (lowerMessage.includes("process") || lowerMessage.includes("how")) {
    response = "The loan process involves: 1) Initial application with basic details, 2) Document submission, 3) Credit assessment, 4) Approval and disbursement. The entire process typically takes 3-5 business days.";
  } else if (lowerMessage.includes("help") || lowerMessage.includes("assist")) {
    response = "I can assist you with loan planning, eligibility assessment, comparing offers, and understanding our green financing options.";
  } else {
    response = "I am here to assist with all your banking needs. You may inquire about loan eligibility, repayment planning, interest rates, or our sustainable financing options.";
  }

  return {
    response,
    flags,
    category: "general_inquiry"
  };
}
