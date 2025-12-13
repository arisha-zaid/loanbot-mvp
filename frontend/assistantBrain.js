import { coordinator } from "./coordinator";

export async function runAssistant(text, context) {
  return await coordinator(text, context);
}
