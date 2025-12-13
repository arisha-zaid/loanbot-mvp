export function riskAgent(input) {
  // mock but realistic
  const score = 720;
  const ratio = 0.32;

  return {
    riskScore: score,
    emiRatio: ratio,
    classification: "LOW",
    flags: []
  };
}
