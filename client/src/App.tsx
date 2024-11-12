import { ChangeEvent, useCallback, useState } from "react";
import printJS from "print-js";
import "./App.css";

function App() {
  const [pdf, setPdf] = useState<string | undefined>(undefined);

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

          // without data uri
          const pdfBase64 = await response.text();
          setPdf(pdfBase64);
        } catch (error) {
          console.error("Error uploading or modifying PDF:", error);
        }
      }
    },
    [],
  );

  const handlePrint = useCallback(() => {
    const print = async () => {
      if (pdf) {
        printJS({ printable: pdf, type: "pdf", base64: true });
      }
    };
    print();
  }, [pdf]);

  const handleOpen = useCallback(() => {
    const open = async () => {
      if (pdf) {
        window.open("data:application/pdf;base64," + pdf, "_blank");
      }
    };
    open();
  }, [pdf]);

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

      {pdf && (
        <div>
          <button onClick={handlePrint}>Print</button>
          <button onClick={handleOpen}>Open</button>
        </div>
      )}
    </div>
  );
}

export default App;
