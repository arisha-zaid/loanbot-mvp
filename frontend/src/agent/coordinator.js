import { riskAgent } from "./riskAgent";
import { plannerAgent } from "./plannerAgent";
import { esgAgent } from "./esgAgent";
import { offersAgent } from "./offersAgent";
import { consultantAgent } from "./consultantAgent";
import { applyBankTone, generatePoliteQuestion, formatCurrency } from "./tone";
import { getMissingFields, isReadyForOffer } from "./memoryStore";

export async function coordinator(intent, userMessage, memory) {
  let response;

  switch (intent) {
    case "PLANNER":
      response = await handlePlanner(userMessage, memory);
      break;
    case "RISK":
      response = await handleRisk(userMessage, memory);
      break;
    case "OFFERS":
      response = await handleOffers(userMessage, memory);
      break;
    case "ESG":
      response = await handleESG(userMessage, memory);
      break;
    case "CONSULTANT":
    default:
      response = await handleConsultant(userMessage, memory);
      break;
  }

  return {
    type: `${intent.toLowerCase()}.response`,
    reply: applyBankTone(response.message),
    data: response.data || {}
  };
}

async function handlePlanner(userMessage, memory) {
  const missingFields = getMissingFields();
  
  if (missingFields.length > 0 && !memory.amount) {
    return {
      message: generatePoliteQuestion("amount"),
      data: { awaiting: "amount" }
    };
  }

  const planResult = plannerAgent(userMessage, memory);
  
  const message = `
Based on your requirements, here is your loan repayment plan:

Loan Amount: ${formatCurrency(planResult.amount)}
Interest Rate: ${planResult.rate}% per annum
Tenure: ${planResult.tenure} months
Monthly EMI: ${formatCurrency(planResult.emi)}

This plan is structured to align with your financial capacity. ${planResult.advice || ""}
  `.trim();

  return { message, data: planResult };
}

async function handleRisk(userMessage, memory) {
  if (!memory.income) {
    return {
      message: generatePoliteQuestion("income"),
      data: { awaiting: "income" }
    };
  }

  const riskResult = riskAgent(userMessage, memory);
  
  let riskDescription;
  switch (riskResult.classification) {
    case "LOW":
      riskDescription = "Your risk profile is favorable, indicating strong eligibility for our loan products.";
      break;
    case "MEDIUM":
      riskDescription = "Your risk profile is moderate. We can proceed with additional documentation.";
      break;
    case "HIGH":
      riskDescription = "Your risk profile requires careful review. We recommend discussing options with our specialist.";
      break;
    default:
      riskDescription = "Your risk assessment is being processed.";
  }

  const message = `
${riskDescription}

Credit Assessment Score: ${riskResult.riskScore}
EMI-to-Income Ratio: ${(riskResult.emiRatio * 100).toFixed(1)}%
Risk Classification: ${riskResult.classification}

${riskResult.flags.length > 0 ? "Observations: " + riskResult.flags.join(", ") : "No concerns identified."}
  `.trim();

  return { message, data: riskResult };
}

async function handleOffers(userMessage, memory) {
  if (!isReadyForOffer()) {
    const missing = getMissingFields();
    const nextField = missing[0];
    return {
      message: `Before presenting loan offers, ${generatePoliteQuestion(nextField).toLowerCase()}`,
      data: { awaiting: nextField }
    };
  }

  const riskResult = riskAgent(userMessage, memory);
  const planResult = plannerAgent(userMessage, memory);
  const esgResult = esgAgent(userMessage, memory);

  const offerResult = offersAgent({ risk: riskResult, plan: planResult, esg: esgResult, memory });

  const message = `
Based on your profile, we are pleased to present the following loan offer:

${offerResult.summary}

This offer is subject to standard terms and conditions. Would you like to proceed with the application?
  `.trim();

  return { message, data: offerResult };
}

async function handleESG(userMessage, memory) {
  const esgResult = esgAgent(userMessage, memory);

  if (esgResult.eligible) {
    const message = `
Congratulations. Your investment qualifies for our Green Loan Program.

Benefit: ${esgResult.benefit}
Environmental Impact: Contributing to sustainable development

This preferential rate reflects our commitment to environmental responsibility. Standard loan terms apply with enhanced benefits for eco-friendly investments.
    `.trim();
    return { message, data: esgResult };
  }

  const message = `
Thank you for your interest in our Green Loan Program. This program offers preferential rates for:

• Solar panel installations
• Electric vehicle purchases
• Energy-efficient home improvements
• Sustainable business investments

Would you like to explore how your planned investment might qualify for these benefits?
  `.trim();

  return { message, data: esgResult };
}

async function handleConsultant(userMessage, memory) {
  const result = consultantAgent(userMessage, memory);

  const message = `
Thank you for your inquiry. ${result.response}

${result.flags && result.flags.length > 0 ? "Key observations from our analysis:" : ""}
${result.flags ? result.flags.map(f => `• ${f.text} (${f.status})`).join("\n") : ""}

How else may I assist you with your banking needs today?
  `.trim();

  return { message, data: result };
}
