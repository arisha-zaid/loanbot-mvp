const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const fs = require("fs");

async function generateReceipt(data) {
  const doc = new PDFDocument({ margin: 50 });
  const filePath = `receipts/${data.receiptId}.pdf`;
  doc.pipe(fs.createWriteStream(filePath));

  // HEADER
  doc.fontSize(18).text("EY FlowBot Bank", { align: "center" });
  doc.fontSize(12).text("Corporate Lending Division", { align: "center" });
  doc.moveDown();
  doc.text("EMI PAYMENT RECEIPT", { align: "center", underline: true });

  doc.moveDown(2);

  // META
  doc.fontSize(10);
  doc.text(`Receipt ID: ${data.receiptId}`);
  doc.text(`Loan ID: ${data.loanId}`);
  doc.text(`Customer Name: ${data.name}`);
  doc.text(`Payment Date: ${data.date}`);
  doc.text(`Payment Mode: ${data.mode}`);

  doc.moveDown();

  // PAYMENT DETAILS
  doc.fontSize(12).text("Payment Summary", { underline: true });
  doc.fontSize(10);
  doc.text(`EMI Paid: ₹${data.emi}`);
  doc.text(`Principal: ₹${data.principal}`);
  doc.text(`Interest: ₹${data.interest}`);
  doc.text(`Outstanding Balance: ₹${data.balance}`);

  doc.moveDown();

  // AI EXPLANATION
  doc.fontSize(12).text("AI Approval References", { underline: true });
  doc.fontSize(10);
  data.reasons.forEach(r => doc.text(`• ${r}`));

  // QR
  const qr = await QRCode.toDataURL(data.qrLink);
  doc.image(qr, 400, 500, { width: 100 });

  // SIGNATURE
  doc.moveDown(6);
  doc.text("Digitally signed by EY FlowBot Bank");
  doc.text(`Signature ID: ${data.signatureId}`);
  doc.text(`Timestamp: ${data.timestamp}`);

  doc.end();
  return filePath;
}

module.exports = generateReceipt;
