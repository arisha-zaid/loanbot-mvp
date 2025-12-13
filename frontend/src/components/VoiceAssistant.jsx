import { useEffect, useRef, useState } from "react";
import { callGemini } from "../api/gemini";
import { voicePrompt } from "../prompts/prompts";

export default function VoiceAssistant({ onCommand }) {
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);

  // INIT SPEECH RECOGNITION (ONCE)
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      console.error("Speech Recognition not supported");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = false; // VERY IMPORTANT
    recognition.interimResults = false;

    recognition.onresult = async (event) => {
      const text = event.results[0][0].transcript.trim();
      console.log("User said:", text);

      // stop mic immediately
      recognition.stop();
      setListening(false);

      await handleVoiceCommand(text);
    };

    recognition.onerror = (e) => {
      console.error("Speech error:", e);
      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => recognition.stop();
  }, []);

  // HANDLE VOICE → AI → ACTION
  async function handleVoiceCommand(text) {
    try {
      const jsonRes = await callGemini(voicePrompt(text));

      const action = JSON.parse(jsonRes);
      onCommand(action);

      speakResponse(
        action.reply || "Your request has been processed."
      );
    } catch (err) {
      console.error("Voice parse error");
      speakResponse("I understood your request, but need clarification.");
    }
  }

  // TEXT → SPEECH
  function speakResponse(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    utterance.rate = 0.95;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }

  // BUTTON HANDLER
  function toggleListening() {
    if (!recognitionRef.current) return;

    if (!listening) {
      setListening(true);
      recognitionRef.current.start();
    } else {
      setListening(false);
      recognitionRef.current.stop();
    }
  }

  // UI (DO NOT REMOVE)
  return (
    <button
      onClick={toggleListening}
      className={`bg-blue-600 text-white px-3 py-2 rounded-full transition ${
        listening ? "animate-pulse " : ""
      }`}
    >
      {listening ? "Listening…" : <i class="fa-solid fa-microphone"></i>}
    </button>
  );
}
