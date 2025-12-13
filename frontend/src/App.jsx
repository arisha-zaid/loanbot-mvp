import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Consultant from "./components/Consultant";
import Planner from "./components/Planner";
import Ecoloan from "./components/Ecoloan";
import Offers from "./components/Offers";

import { useState } from "react";

export default function App() {
  const [listening, setListening] = useState(false);

  const handleVoice = (action) => {
    console.log("Voice triggered:", action);
    // Later: navigate(`/planner`) etc
  };

  return (
    <Router>
      {/* Global background like Gemini */}
      <div className="min-h-screen w-full bg-gradient-to-b from-white via-slate-50 to-white text-gray-900">
        
        <Navbar />

        {/* Main content container */}
        <main className="max-w-7xl mx-auto px-6 pt-16 pb-28">
          <Routes>
            <Route path="/" element={<Dashboard listening={listening} setListening={setListening} />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/consultant" element={<Consultant />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/ecoloan" element={<Ecoloan />} />
            <Route path="/offers" element={<Offers />} />
            <Route
              path="/terms"
              element={
                <div className="bg-white rounded-2xl p-8 shadow-sm border">
                  <h2 className="text-xl font-semibold mb-4">Terms & Conditions</h2>
                  <p className="text-gray-600 text-sm">
                    This is a placeholder for EY FlowBot terms & conditions.
                  </p>
                </div>
              }
            />
          </Routes>
        </main>

        {/* Floating Gemini-style voice assistant removed — control is in the header/search */}
      </div>
    </Router>
  );
}
