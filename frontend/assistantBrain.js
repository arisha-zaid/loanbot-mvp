import { callGemini } from "./src/api/gemini";
import { intentExtractionPrompt } from "./src/prompts/prompts";
import { updateMemory, getMemory, addToHistory } from "./src/agent/memoryStore";
import { coordinator } from "./src/agent/coordinator";

export async function runAssistant(userMessage) {
  addToHistory("user", userMessage);

  let intentData;
  try {
    const geminiResponse = await callGemini(intentExtractionPrompt(userMessage));
    intentData = parseIntentResponse(geminiResponse);
  } catch (error) {
    console.error("Intent extraction failed:", error);
    intentData = {
      intent: "CONSULTANT",
      confidence: 0.5,
      entities: {}
    };
  }

  updateMemory(intentData.entities);
  updateMemory({ lastIntent: intentData.intent });

  const memory = getMemory();
  const result = await coordinator(intentData.intent, userMessage, memory);

  addToHistory("assistant", result.reply);

  return {
    reply: result.reply,
    intent: intentData.intent,
    confidence: intentData.confidence,
    memory: memory
  };
}

function parseIntentResponse(response) {
  try {
    let jsonStr = response.trim();
    
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonStr = jsonMatch[0];
    }
    
    const parsed = JSON.parse(jsonStr);
    
    return {
      intent: parsed.intent || "CONSULTANT",
      confidence: parsed.confidence || 0.7,
      entities: {
        income: parsed.entities?.income || null,
        loanType: parsed.entities?.loanType || null,
        tenure: parsed.entities?.tenure || null,
        amount: parsed.entities?.amount || null
      }
    };
  } catch (e) {
    console.error("Failed to parse intent JSON:", e);
    return {
      intent: "CONSULTANT",
      confidence: 0.5,
      entities: {}
    };
  }
}
