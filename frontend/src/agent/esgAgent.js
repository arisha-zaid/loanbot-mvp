export function esgAgent(input) {
  if (input.toLowerCase().includes("solar")) {
    return { eligible: true, benefit: "0.5% rate reduction" };
  }
  return { eligible: false };
}
