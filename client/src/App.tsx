import { ChangeEvent, useCallback, useEffect, useState } from "react";
import "./App.css";
// import { PDFDocument, rgb } from "pdf-lib";

// async function modifyPdf(pdfBytes: ArrayBuffer) {
//   const pdfDoc = await PDFDocument.load(pdfBytes);

//   const pages = pdfDoc.getPages();
//   const firstPage = pages[0];
//   const { width, height } = firstPage.getSize();

//   const svgPath = `M 0,${height / 2} L ${width},${height / 2} L ${width},${height} L 0,${height} Z`;

//   firstPage.moveTo(0, firstPage.getHeight());
//   firstPage.drawSvgPath(svgPath, { color: rgb(1, 1, 1) });

//   return pdfDoc;
// }

function App() {
  const [pdfSrc, setPdfSrc] = useState<string | undefined>(undefined);

  const onPdfUploaded = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      if (event === null || event.target.files === null) return;

      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("pdf", file);

        try {
          const response = await fetch("/api/upload-pdf", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Failed to modify PDF");
          }

          const pdfBlob = await response.blob();
          const pdfBlobUrl = URL.createObjectURL(pdfBlob);
          setPdfSrc(pdfBlobUrl);
        } catch (error) {
          console.error("Error uploading or modifying PDF:", error);
        }
      }
    },
    [],
  );

  useEffect(() => {
    if (pdfSrc) {
      window.open(pdfSrc, "_blank");
    }
  }, [pdfSrc]);

  return (
    <div id="app">
      <div>
        <h1>DHL PDF Cleaner</h1>

        <div className="formField">
          <label htmlFor="file">Choose PDF file to upload</label>
          <input
            type="file"
            id="file"
            name="file"
            accept="application/pdf"
            onChange={onPdfUploaded}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
