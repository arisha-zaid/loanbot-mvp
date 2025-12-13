import { useState, useEffect } from "react";
import { callGemini } from "../api/gemini";
import { offersPrompt } from "../prompts/prompts";

export default function Offers({ riskScore=70, emi=23500, green=false, tenure=24, rate=0.099, fee=1500 }) {
  const [offerText,setOfferText] = useState("");
  const [timeLeft,setTimeLeft] = useState(15*60);

  useEffect(()=>{
    const generateOffer = async () => {
      const res = await callGemini(offersPrompt(riskScore,emi,green,tenure,rate,fee));
      setOfferText(res);
    }
    generateOffer();
  },[riskScore,emi,green]);

  useEffect(()=>{
    const timer = setInterval(()=>setTimeLeft(t=>t>0?t-1:0),1000);
    return ()=>clearInterval(timer);
  },[]);

  const formatTime = sec => `${Math.floor(sec/60).toString().padStart(2,'0')}:${(sec%60).toString().padStart(2,'0')}`;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Your Loan Offer</h2>
      <div className="p-6 border rounded-lg bg-white shadow-md flex flex-col space-y-4">
        <p>{offerText}</p>
        <div className="text-gray-600">Rate valid for: <span className="font-bold">{formatTime(timeLeft)}</span></div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Approve & Lock</button>
      </div>
    </div>
  )
}
