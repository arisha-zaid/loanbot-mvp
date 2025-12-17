import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";
import { generateReceipt } from "./generateReceipt.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/api/gemini", async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await client.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200
    });
    res.json({ result: response.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/receipt", async (req, res) => {
  try {
    const memory = req.body;

    const receiptData = {
      receiptId: `EY-${Date.now().toString(36).toUpperCase()}`,
      customerRef: `CUST-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      loanType: memory.loanType || "Standard Loan",
      amount: memory.amount || 5000000,
      rate: memory.rate || 10.9,
      tenure: memory.tenure || 60,
      emi: memory.emi || calculateEMI(memory.amount || 5000000, memory.rate || 10.9, memory.tenure || 60),
      processingFee: memory.processingFee || 5000,
      eligibilityStatus: memory.eligibilityStatus || "Pre-Approved",
      riskScore: memory.riskScore || 720,
      riskClassification: memory.riskClassification || "LOW",
      emiRatio: memory.emiRatio || 0.32,
      esgEligible: memory.esgEligible || false,
      income: memory.income,
      reasons: [
        "Application meets credit criteria",
        "Income verification satisfactory",
        memory.esgEligible ? "Green loan benefit applied" : "Standard terms applied"
      ]
    };

    await generateReceipt(receiptData, res);
  } catch (err) {
    console.error("Receipt generation error:", err);
    res.status(500).json({ error: "Failed to generate receipt: " + err.message });
  }
});

function calculateEMI(principal, rate, tenure) {
  const monthlyRate = rate / 1200;
  return Math.round(
    (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -tenure))
  );
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
