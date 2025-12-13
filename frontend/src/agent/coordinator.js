import { riskAgent } from "./riskAgent";
import { plannerAgent } from "./plannerAgent";
import { esgAgent } from "./esgAgent";
import { offersAgent } from "./offersAgent";

export async function coordinator(input, context = {}) {
  // 1. Conversation Agent → Coordinator
  const risk = riskAgent(input, context);

  // 2. Planner runs only if risk acceptable
  const plan = plannerAgent(input, risk);

  // 3. ESG runs in parallel
  const esg = esgAgent(input);

  // 4. Offers aggregate everything
  const offer = offersAgent({ risk, plan, esg });

  return {
    type: "offer.generated",
    reply: offer.summary,
    data: offer
  };
}
