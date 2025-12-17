import { useState } from "react";
import VoiceAssistant from "./VoiceAssistant";
import { runAssistant } from "../../assistantBrain";
import { downloadLoanReceipt } from "../utils/receiptDownload";

export default function Dashboard() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function runAI(text) {
    if (!text) return;

    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const result = await runAssistant(text);

      setMessages((m) => [
        ...m,
        { role: "bot", text: result.reply }
      ]);

      speakSafe(result.reply);
    } catch (err) {
      console.error("AI error:", err);
      setMessages((m) => [
        ...m,
        { role: "bot", text: "I apologize for the inconvenience. Please try again." }
      ]);
    }

    setLoading(false);
  }

  function speakSafe(text) {
    if (!window.speechSynthesis) return;
    const cleanText = text
      .replace(/[₹]/g, " rupees ")
      .replace(/[•]/g, "")
      .replace(/\n+/g, ". ")
      .substring(0, 500);
    const u = new SpeechSynthesisUtterance(cleanText);
    u.lang = "en-IN";
    u.rate = 0.92;
    window.speechSynthesis.speak(u);
  }

  async function handleDownloadReceipt() {
    const result = await downloadLoanReceipt();
    if (result.success) {
      setMessages((m) => [
        ...m,
        { role: "bot", text: "Your loan receipt has been downloaded successfully." }
      ]);
    } else {
      setMessages((m) => [
        ...m,
        { role: "bot", text: "Unable to generate receipt at this time. Please try again." }
      ]);
    }
  }

  return (
    <section className="mt-24 text-center px-4">
      <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
        Corporate funding,
        <br /> simplified.
      </h1>

      <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto">
        An AI-driven approach to instant, intelligent loan approvals.
      </p>

      <p className="mt-4 text-sm text-gray-400">
        Pre-approved up to ₹72L • Credit Health: Strong • Avg approval &lt; 2 mins
      </p>

      <div className="mt-12 flex justify-center">
        <div className="flex items-center w-full max-w-2xl bg-white rounded-full shadow-[0_10px_30px_rgba(59,130,246,0.12)] hover:shadow-[0_15px_40px_rgba(59,130,246,0.18)] border border-gray-200 px-6 py-4 transition-shadow focus-within:ring-1 focus-within:ring-blue-400">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runAI(input)}
            placeholder="Tell me what you need, e.g., ₹50L for equipment"
            className="flex-1 bg-transparent outline-none text-gray-700 text-base placeholder-gray-400"
          />

          <VoiceAssistant
            onCommand={(action) => {
              setMessages((m) => [
                ...m,
                { role: "bot", text: action.reply }
              ]);
              speakSafe(action.reply);
            }}
          />

          <button
            onClick={() => runAI(input)}
            disabled={loading}
            className="ml-3 h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition disabled:opacity-50"
          >
            ➤
          </button>
        </div>
      </div>

      <p className="mt-6 text-sm text-gray-400">
        You can also use voice commands
      </p>

      <div className="mt-10 flex justify-center gap-3 flex-wrap">
        {["View Loans", "Pay EMI", "Ask LoanBot"].map(action => (
          <button
            key={action}
            onClick={() => runAI(action)}
            className="px-5 py-2 rounded-full bg-white text-sm text-gray-700 shadow-sm border border-gray-200 hover:text-blue-600 hover:shadow transition"
          >
            {action}
          </button>
        ))}
        <button
          onClick={handleDownloadReceipt}
          className="px-5 py-2 rounded-full bg-white text-sm text-gray-700 shadow-sm border border-gray-200 hover:text-blue-600 hover:shadow transition"
        >
          Download Receipt
        </button>
      </div>

      <div className="mt-10 max-w-2xl mx-auto space-y-4 text-left">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-4 rounded-xl text-sm whitespace-pre-line ${
              m.role === "user"
                ? "bg-blue-50 text-blue-900 ml-auto max-w-[80%]"
                : "bg-white border text-gray-800"
            }`}
          >
            {m.text}
          </div>
        ))}

        {loading && (
          <div className="text-sm text-gray-400 flex items-center gap-2">
            <i className="fa-solid fa-spinner fa-spin"></i>
            LoanBot is processing your request…
          </div>
        )}
      </div>

      <div className="mt-14 max-w-xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-left">
        <p className="text-sm text-gray-400">Active Loan</p>
        <h3 className="mt-1 text-lg font-semibold text-gray-800">
          Business Expansion Loan
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          EMI ₹68,450 • Due in 5 days
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Outstanding ₹12.4L
        </p>
        <button 
          onClick={() => runAI("View my loan schedule")}
          className="mt-4 text-sm text-blue-600 hover:underline"
        >
          View schedule →
        </button>
      </div>

      <div className="mt-16">
        <p className="text-gray-600">
          Want to know how your loan was approved?
        </p>
        <button 
          onClick={() => runAI("Explain my loan approval reasoning")}
          className="mt-2 text-blue-600 hover:underline text-sm"
        >
          View approval reasoning →
        </button>
      </div>

      <div className="mt-14 max-w-xl mx-auto bg-blue-50/60 backdrop-blur rounded-xl px-4 py-3 text-sm text-blue-700">
        🔔 EMI due in 5 days • 
        <button onClick={handleDownloadReceipt} className="underline ml-1">
          Download receipt
        </button>
      </div>

      <p className="mt-10 text-xs text-gray-400">
        RBI-aligned • End-to-end encrypted • Digitally signed documents
      </p>
    </section>
  );
}
