import { ChangeEvent, useCallback, useState } from "react";
import { saveAs } from "file-saver";

function App() {
  const [pdf, setPdf] = useState<Blob | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  const onPdfUploaded = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      setPdf(undefined);

      if (event === null || event.target.files === null) return;

      const file = event.target.files[0];
      if (file) {
        setLoading(true);
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
          const pdf = await response.blob();
          setLoading(false);
          setPdf(pdf);
        } catch (error) {
          setLoading(false);
          setError(error as Error);
        }
      }
    },
    [],
  );

  const handleOpen = useCallback(() => {
    const open = async () => {
      if (pdf) {
        saveAs(URL.createObjectURL(pdf));
      }
    };
    open();
  }, [pdf]);

  return (
    <div className="font-sans flex flex-col gap-4 m-4">
      <h1 className="text-2xl font-bold">DHL PDF Cleaner</h1>
      <label htmlFor="file">Choose PDF file to upload</label>
      <input
        type="file"
        id="file"
        name="file"
        accept="application/pdf"
        onChange={onPdfUploaded}
      />

      {loading && <div>Processing</div>}

      {error && <div>Error uploading or modifying PDF: ${error.message}</div>}

      {pdf && (
        <>
          <div>
            <button
              onClick={handleOpen}
              className="bg-cyan-300 p-3 w-64 rounded-md"
            >
              Download
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
