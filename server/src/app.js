const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();
const port = 3000;

const upload = multer({ storage: multer.memoryStorage() });

app.post("/api/upload-pdf", upload.single("pdf"), async (req, res) => {
  try {
    const pdfBuffer = req.file.buffer;
    const modifiedPdfBuffer = await modifyPdf(pdfBuffer);
    res.setHeader("Content-Type", "application/pdf");
    res.send(modifiedPdfBuffer);
  } catch (error) {
    console.error("Error modifying PDF:", error);
    res.status(500).json({ error: "Failed to modify PDF" });
  }
});

app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

async function modifyPdf(pdfBuffer) {
  return pdfBuffer;
}
