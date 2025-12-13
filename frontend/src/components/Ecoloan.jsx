import { useState } from "react";

export default function Ecoloan() {
  const [green, setGreen] = useState(false);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Ecoloan Benefits</h2>
      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2 cursor-pointer">
          <span>Loan for sustainable purposes?</span>
          <input type="checkbox" className="toggle-checkbox" checked={green} onChange={()=>setGreen(!green)}/>
          <span className="toggle-slider bg-green-200"></span>
        </label>
        {green && <span className="text-green-600 font-bold">50% processing fee waived!</span>}
      </div>
    </div>
  )
}
