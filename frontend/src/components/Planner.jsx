import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { callGemini } from "../api/gemini";
import { plannerPrompt } from "../prompts/prompts";

export default function Planner({ principal=500000, rate=0.09, months=24 }) {
  const [extraEMI,setExtraEMI] = useState(0);
  const [data,setData] = useState([]);
  const [advice,setAdvice] = useState("");

  const calculateEMI = (p,r,n) => (p*r/12*Math.pow(1+r/12,n))/(Math.pow(1+r/12,n)-1);

  useEffect(()=>{
    const newData = [];
    for(let i=0;i<=6;i++){
      const extra = i*500;
      const emi = calculateEMI(principal, rate, months)+extra;
      const interest = emi*months-principal;
      newData.push({extra,interest:Math.round(interest)});
    }
    setData(newData);
  },[extraEMI]);

  useEffect(()=>{
    const getAdvice = async () => {
      const res = await callGemini(plannerPrompt(principal,rate,months,extraEMI));
      setAdvice(res);
    }
    getAdvice();
  },[extraEMI]);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">EMI Simulator</h2>
      <input type="range" min="0" max="3000" step="500" value={extraEMI} onChange={e=>setExtraEMI(Number(e.target.value))} className="w-full mb-6"/>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="extra" label={{value:'Extra EMI',position:'insideBottom',offset:-5}}/>
          <YAxis label={{value:'Interest', angle:-90, position:'insideLeft'}}/>
          <Tooltip/>
          <Line type="monotone" dataKey="interest" stroke="#10B981" strokeWidth={3}/>
        </LineChart>
      </ResponsiveContainer>
      <p className="mt-4 text-gray-700 font-medium">{advice}</p>
    </div>
  )
}
