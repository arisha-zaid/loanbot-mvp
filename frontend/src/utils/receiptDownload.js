import { getMemory } from "../agent/memoryStore";

export async function downloadLoanReceipt(additionalData = {}) {
  const memory = getMemory();

  const receiptPayload = {
    ...memory,
    ...additionalData,
    timestamp: new Date().toISOString()
  };

  try {
    const response = await fetch("http://localhost:5000/api/receipt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(receiptPayload)
    });

    if (!response.ok) {
      throw new Error("Failed to generate receipt");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Loan_Receipt.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true, message: "Receipt downloaded successfully" };
  } catch (error) {
    console.error("Receipt download error:", error);
    return { success: false, message: error.message };
  }
}

export async function previewReceipt(additionalData = {}) {
  const memory = getMemory();

  const receiptPayload = {
    ...memory,
    ...additionalData,
    timestamp: new Date().toISOString()
  };

  try {
    const response = await fetch("http://localhost:5000/api/receipt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(receiptPayload)
    });

    if (!response.ok) {
      throw new Error("Failed to generate receipt");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    window.open(url, "_blank");

    return { success: true, message: "Receipt opened in new tab" };
  } catch (error) {
    console.error("Receipt preview error:", error);
    return { success: false, message: error.message };
  }
}
