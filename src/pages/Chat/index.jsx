import React, { useState, useEffect } from "react";
import ChatInterface from "../../components/ChatInterface";
import PdfViewer from "../../components/PdfViewer";
import { useNavigate } from "react-router-dom";

export default function Chat() {
  const [fileUrl, setFileUrl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedFileUrl = localStorage.getItem("fileUrl");
    if (storedFileUrl) {
      console.log("Stored File URL:", storedFileUrl); // 🔍 Debugging

      setFileUrl(storedFileUrl);
    } else {
      navigate("/"); // ✅ Redirect to home if no file is uploaded
    }
  }, [navigate]);
  if (!fileUrl) return <p className="text-gray-500">Loading PDF...</p>;

  return (
    <div className="h-screen flex overflow-hidden">
      <div className="w-1/2 h-full p-4 bg-gray-100 flex flex-col ">
        <ChatInterface />
      </div>
      <div className="w-1/2 p-2 h-screen overflow-hidden flex flex-col">
        <div className="flex-grow overflow-auto">
          <PdfViewer fileUrl={fileUrl} />
        </div>
      </div>
    </div>
  );
}
