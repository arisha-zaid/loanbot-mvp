import { useEffect, useRef, useState } from "react";
import { runAssistant } from "../../assistantBrain";

export default function VoiceAssistant({ onCommand }) {
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      console.error("Speech Recognition not supported");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = async (event) => {
      const text = event.results[0][0].transcript.trim();
      console.log("User said:", text);

      recognition.stop();
      setListening(false);
      setProcessing(true);

      await handleVoiceCommand(text);
      setProcessing(false);
    };

    recognition.onerror = (e) => {
      console.error("Speech error:", e);
      setListening(false);
      setProcessing(false);
    };

    recognitionRef.current = recognition;

    return () => recognition.stop();
  }, []);

  async function handleVoiceCommand(text) {
    try {
      const result = await runAssistant(text);

      if (onCommand) {
        onCommand({
          action: result.intent,
          reply: result.reply,
          data: result.memory
        });
      }

      speakResponse(result.reply);
    } catch (err) {
      console.error("Voice processing error:", err);
      speakResponse("I apologize for the inconvenience. Please try again.");
    }
  }

  function speakResponse(text) {
    const cleanText = text
      .replace(/[₹]/g, " rupees ")
      .replace(/[•]/g, "")
      .replace(/\n+/g, ". ")
      .substring(0, 500);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "en-IN";
    utterance.rate = 0.92;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }

  function toggleListening() {
    if (!recognitionRef.current) return;

    if (!listening && !processing) {
      setListening(true);
      recognitionRef.current.start();
    } else if (listening) {
      setListening(false);
      recognitionRef.current.stop();
    }
  }

  return (
    <button
      onClick={toggleListening}
      disabled={processing}
      className={`bg-blue-600 text-white px-3 py-2 rounded-full transition ${
        listening ? "animate-pulse bg-red-500" : ""
      } ${processing ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {processing ? (
        <i className="fa-solid fa-spinner fa-spin"></i>
      ) : listening ? (
        "Listening…"
      ) : (
        <i className="fa-solid fa-microphone"></i>
      )}
    </button>
  );
}
