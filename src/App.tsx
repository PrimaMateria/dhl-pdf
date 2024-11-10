import { ChangeEvent, useCallback, useState } from "react";
import "./App.css";
import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";

async function modifyPdf(pdfBytes: ArrayBuffer) {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();
  firstPage.drawText("This text was added with JavaScript!", {
    x: 5,
    y: height / 2 + 300,
    size: 50,
    font: helveticaFont,
    color: rgb(0.95, 0.1, 0.1),
    rotate: degrees(-45),
  });

  return pdfDoc;
}

function App() {
  const [pdfSrc, setPdfSrc] = useState<string | undefined>(undefined);

  const onPdfUploaded = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      if (event === null || event.target.files === null) return;

      const file = event.target.files[0];
      if (file) {
        // Read the uploaded file as ArrayBuffer
        const pdfBytes = await file.arrayBuffer();

        // Modify the PDF
        const pdfDoc = await modifyPdf(pdfBytes);

        // Save modified PDF as Data URI and update the iframe src
        const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
        setPdfSrc(pdfDataUri);
      }
    },
    [],
  );

  return (
    <div id="app">
      <div>
        <h1>DHL PDF Cleaner</h1>

        <div className="formField">
          <label htmlFor="file">Choose pdf file to upload</label>
          <input
            type="file"
            id="file"
            name="file"
            accept="application/pdf"
            onChange={onPdfUploaded}
          />
        </div>
      </div>

      {pdfSrc && <iframe id="pdf" src={pdfSrc}></iframe>}
    </div>
  );
}

export default App;
