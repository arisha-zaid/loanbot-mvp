const BANK_TONE_RULES = {
  greetings: [
    "Thank you for choosing EY FlowBot.",
    "We appreciate your trust in our services.",
    "It is our pleasure to assist you."
  ],
  
  acknowledgements: [
    "Certainly.",
    "I understand.",
    "Noted.",
    "Thank you for that information."
  ],
  
  transitions: [
    "Moving forward,",
    "Based on your profile,",
    "Having reviewed your details,",
    "Taking into account your requirements,"
  ],
  
  closings: [
    "Please let me know if you require any further assistance.",
    "I am here to help with any additional queries.",
    "Do not hesitate to reach out for clarification."
  ]
};

const INFORMAL_TO_FORMAL = {
  "yeah": "yes",
  "yep": "yes",
  "nope": "no",
  "gonna": "going to",
  "wanna": "want to",
  "gotta": "have to",
  "kinda": "somewhat",
  "sorta": "somewhat",
  "ok": "understood",
  "okay": "understood",
  "sure": "certainly",
  "cool": "acceptable",
  "awesome": "excellent",
  "great": "satisfactory",
  "hey": "",
  "hi": "",
  "hello": ""
};

const BANNED_PHRASES = [
  "I need more clarity",
  "I'm not sure",
  "I don't know",
  "maybe",
  "perhaps",
  "might be",
  "could be",
  "I think",
  "probably",
  "sort of",
  "kind of",
  "basically",
  "actually",
  "honestly",
  "to be honest",
  "like I said",
  "you know"
];

export function applyBankTone(rawResponse, context = {}) {
  if (!rawResponse || typeof rawResponse !== "string") {
    return "Thank you for your inquiry. How may I assist you with your loan requirements today?";
  }

  let response = rawResponse;

  BANNED_PHRASES.forEach(phrase => {
    const regex = new RegExp(phrase, "gi");
    response = response.replace(regex, "");
  });

  Object.entries(INFORMAL_TO_FORMAL).forEach(([informal, formal]) => {
    const regex = new RegExp(`\\b${informal}\\b`, "gi");
    response = response.replace(regex, formal);
  });

  response = response.replace(/!+/g, ".");
  response = response.replace(/\?{2,}/g, "?");
  response = response.replace(/\.{2,}/g, ".");

  response = response.replace(/\s{2,}/g, " ").trim();

  if (!response.match(/[.!?]$/)) {
    response += ".";
  }

  response = capitalizeFirstLetter(response);

  return response;
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return "N/A";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatPercentage(value) {
  if (value === null || value === undefined) return "N/A";
  return `${value.toFixed(2)}%`;
}

export function generatePoliteQuestion(field) {
  const questions = {
    income: "May I kindly request your monthly income for accurate assessment?",
    loanType: "What type of loan would you be interested in? We offer home, car, personal, business, and education loans.",
    tenure: "What loan tenure would suit your repayment preferences? Please specify in months.",
    amount: "What loan amount are you considering? This will help us tailor the best offer for you."
  };
  
  return questions[field] || "Could you please provide additional details?";
}

export function generateAcknowledgement(field, value) {
  const formatted = typeof value === "number" ? formatCurrency(value) : value;
  
  const templates = {
    income: `Thank you. Your monthly income of ${formatted} has been noted.`,
    loanType: `Noted. You are interested in a ${value} loan.`,
    tenure: `Understood. You prefer a tenure of ${value} months.`,
    amount: `Thank you. Your requested loan amount of ${formatted} has been recorded.`
  };
  
  return templates[field] || `Thank you for providing that information.`;
}
