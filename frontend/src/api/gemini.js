// src/api/gemini.js
export async function callGemini(prompt) {
  try {
    const response = await fetch("http://localhost:5000/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    if (data.result) return data.result;
    throw new Error(data.error || "No response from server");
  } catch (err) {
    console.error("Error calling Gemini API:", err);
    return "Error generating response";
  }
}
