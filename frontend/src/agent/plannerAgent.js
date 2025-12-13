export function plannerAgent(input, risk) {
  const amount = 5000000;
  const rate = 10.9;
  const tenure = 60;

  const emi = Math.round(
    (amount * rate / 1200) /
    (1 - Math.pow(1 + rate / 1200, -tenure))
  );

  return {
    amount,
    rate,
    tenure,
    emi
  };
}
