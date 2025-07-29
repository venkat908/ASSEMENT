import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PDFViewer({ fileUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState(null);

  const handleLoadError = (error) => {
    console.error("Error loading PDF:", error);
    setError("Failed to load PDF file.");
  };
  useEffect(() => {
    setNumPages(null); // Reset pages
    setPageNumber(1); // Reset to first page on new PDF
    console.log("Received fileUrl in PdfViewer:", fileUrl); // 🔍 Debugging
  }, [fileUrl]);

  if (!fileUrl) return <p className="text-gray-500">No PDF uploaded</p>;
  return (
    <div className="flex flex-col w-full h-full rounded-lg overflow-hidden">
      <div className="flex flex-wrap justify-between items-center p-1 bg-white shadow-md">
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50 sm:text-sm md:text-base text-center"
          onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
          disabled={pageNumber <= 1}
        >
          Previous
        </button>
        <p className="text-lg sm:text-sm md:text-base text-center">
          Page {pageNumber} of {numPages || "?"}
        </p>
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50 sm:text-sm md:text-base text-center"
          onClick={() => setPageNumber((prev) => Math.min(prev + 1, numPages))}
          disabled={pageNumber >= numPages}
        >
          Next
        </button>
      </div>

      <div className="flex flex-col w-full h-full rounded-lg overflow-hidden pt-1">
        <div className="flex-grow overflow-y-auto max-h-[calc(100vh-100px)] border-gray-300">
          {" "}
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : fileUrl ? (
            <Document
              file={fileUrl}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              onLoadError={handleLoadError}
              className="w-full flex-end
               justify-center"
              crossOrigin="anonymous"
            >
              <Page
                pageNumber={pageNumber}
                width={Math.min(700, window.innerWidth - 40)} // Adjust width based on screen size
                // renderMode="canvas"
              />
            </Document>
          ) : (
            <p className="text-gray-500">No PDF uploaded</p>
          )}
        </div>
      </div>
    </div>
  );
}
