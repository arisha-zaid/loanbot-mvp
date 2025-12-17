import PDFDocument from "pdfkit";
import QRCode from "qrcode";

export async function generateReceipt(data, res) {
  const doc = new PDFDocument({ margin: 50, size: "A4" });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=Loan_Receipt.pdf");

  doc.pipe(res);

  doc.rect(0, 0, doc.page.width, 100).fill("#1a365d");

  doc.fillColor("#ffffff")
    .fontSize(24)
    .font("Helvetica-Bold")
    .text("EY FlowBot Bank", 50, 30, { align: "center" });

  doc.fontSize(12)
    .font("Helvetica")
    .text("Corporate Lending Division", 50, 60, { align: "center" });

  doc.fillColor("#000000");
  doc.moveDown(3);

  doc.fontSize(16)
    .font("Helvetica-Bold")
    .text("LOAN APPLICATION RECEIPT", { align: "center", underline: true });

  doc.moveDown(1.5);

  doc.rect(50, doc.y, doc.page.width - 100, 1).fill("#cccccc");
  doc.moveDown(0.5);

  doc.fontSize(10).font("Helvetica");
  const leftCol = 50;
  const rightCol = 300;
  let yPos = doc.y + 10;

  doc.text("Receipt ID:", leftCol, yPos);
  doc.text(data.receiptId || `EY-${Date.now()}`, rightCol, yPos);
  yPos += 20;

  doc.text("Application Date:", leftCol, yPos);
  doc.text(new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }), rightCol, yPos);
  yPos += 20;

  doc.text("Customer Reference:", leftCol, yPos);
  doc.text(data.customerRef || "CUST-" + Math.random().toString(36).substring(2, 8).toUpperCase(), rightCol, yPos);
  yPos += 30;

  doc.fontSize(14)
    .font("Helvetica-Bold")
    .text("Loan Details", leftCol, yPos);
  yPos += 25;

  doc.rect(50, yPos, doc.page.width - 100, 1).fill("#cccccc");
  yPos += 15;

  doc.fontSize(10).font("Helvetica");

  const details = [
    ["Loan Type", data.loanType || "Standard Loan"],
    ["Loan Amount", formatCurrency(data.amount)],
    ["Interest Rate", `${data.rate || 10.9}% per annum`],
    ["Tenure", `${data.tenure || 60} months`],
    ["Monthly EMI", formatCurrency(data.emi)],
    ["Processing Fee", formatCurrency(data.processingFee || 5000)],
    ["Eligibility Status", data.eligibilityStatus || "Pre-Approved"]
  ];

  details.forEach(([label, value]) => {
    doc.text(label + ":", leftCol, yPos);
    doc.text(value, rightCol, yPos);
    yPos += 20;
  });

  yPos += 20;

  doc.fontSize(14)
    .font("Helvetica-Bold")
    .text("Risk Assessment Summary", leftCol, yPos);
  yPos += 25;

  doc.rect(50, yPos, doc.page.width - 100, 1).fill("#cccccc");
  yPos += 15;

  doc.fontSize(10).font("Helvetica");
  doc.text("Credit Score:", leftCol, yPos);
  doc.text(data.riskScore || "720", rightCol, yPos);
  yPos += 20;

  doc.text("Risk Classification:", leftCol, yPos);
  doc.text(data.riskClassification || "LOW", rightCol, yPos);
  yPos += 20;

  doc.text("EMI-to-Income Ratio:", leftCol, yPos);
  doc.text(`${((data.emiRatio || 0.32) * 100).toFixed(1)}%`, rightCol, yPos);
  yPos += 30;

  if (data.esgEligible) {
    doc.fillColor("#166534")
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("✓ Green Loan Benefit Applied", leftCol, yPos);
    doc.fillColor("#000000");
    yPos += 25;
  }

  doc.fontSize(14)
    .font("Helvetica-Bold")
    .text("Decision Summary", leftCol, yPos);
  yPos += 25;

  doc.fontSize(10).font("Helvetica");
  const reasons = data.reasons || [
    "Application meets credit criteria",
    "Income verification satisfactory",
    "Debt-to-income ratio within acceptable limits"
  ];
  reasons.forEach(reason => {
    doc.text(`• ${reason}`, leftCol, yPos);
    yPos += 18;
  });

  const qrData = JSON.stringify({
    receiptId: data.receiptId || `EY-${Date.now()}`,
    amount: data.amount,
    status: data.eligibilityStatus || "Pre-Approved",
    timestamp: new Date().toISOString()
  });

  try {
    const qrImage = await QRCode.toDataURL(qrData, { width: 100, margin: 1 });
    doc.image(qrImage, doc.page.width - 150, yPos - 60, { width: 80 });
    doc.fontSize(8).text("Scan for verification", doc.page.width - 160, yPos + 25, { width: 100, align: "center" });
  } catch (qrError) {
    console.error("QR generation error:", qrError);
  }

  yPos = doc.page.height - 150;

  doc.rect(50, yPos, doc.page.width - 100, 1).fill("#cccccc");
  yPos += 15;

  doc.fontSize(8)
    .font("Helvetica")
    .fillColor("#666666")
    .text("DISCLAIMER", leftCol, yPos, { underline: true });
  yPos += 15;

  doc.text(
    "This receipt is system-generated and serves as acknowledgment of loan application submission. " +
    "Final approval is subject to document verification and compliance checks. " +
    "This document does not constitute a loan sanction letter. " +
    "EY FlowBot Bank reserves the right to modify terms based on final assessment.",
    leftCol, yPos, { width: doc.page.width - 100, align: "justify" }
  );

  yPos += 50;

  doc.fontSize(9)
    .fillColor("#000000")
    .text("Digitally signed by EY FlowBot Bank", leftCol, yPos);
  doc.text(`Signature ID: SIG-${Date.now().toString(36).toUpperCase()}`, leftCol, yPos + 12);
  doc.text(`Timestamp: ${new Date().toISOString()}`, leftCol, yPos + 24);

  doc.end();
}

function formatCurrency(amount) {
  if (!amount && amount !== 0) return "N/A";
  return "₹" + Number(amount).toLocaleString("en-IN");
}
