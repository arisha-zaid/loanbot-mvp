import { useState } from "react";
import { callGemini } from "../api/gemini";
import { consultantPrompt } from "../prompts/prompts";

export default function Consultant() {
  const [flags,setFlags] = useState([]);
  const [loading,setLoading] = useState(false);

  const analyzeDocs = async (text) => {
    setLoading(true);
    const result = await callGemini(consultantPrompt(text));
    try {
      const parsed = JSON.parse(result);
      setFlags(parsed);
    } catch(e){
      alert("Parsing error. Displaying static example.");
      setFlags([{id:1,text:"High cash withdrawals on weekends",status:"amber"}]);
    }
    setLoading(false);
  }

  const handleResolve = (id) => setFlags(flags.map(f=>f.id===id?{...f,status:"green"}:f));

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Consultant Checks</h2>
      <textarea id="statement" className="border p-2 w-full mb-4" rows={6} placeholder="Paste bank statement here" />
      <button onClick={()=>analyzeDocs(document.getElementById('statement').value)} className="bg-blue-600 text-white px-4 py-2 rounded mb-4">{loading?"Analyzing...":"Analyze"}</button>
      <div className="flex flex-col space-y-4">
        {flags.map(f=>(
          <div key={f.id} className={`p-4 rounded-lg border ${f.status==="amber"?"border-yellow-400 bg-yellow-50":"border-green-400 bg-green-50"} flex justify-between items-center`}>
            <span>{f.text}</span>
            {f.status==="amber" && <button onClick={()=>handleResolve(f.id)} className="bg-green-600 text-white px-3 py-1 rounded">Resolve</button>}
          </div>
        ))}
      </div>
    </div>
  )
}
