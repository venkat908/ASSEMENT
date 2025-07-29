import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import axios from "axios";
import { useDropzone } from "react-dropzone";
import API_BASE_URL from "../../config";

export default function HomePage() {
  const [files, setFiles] = useState("");
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate(); // ✅ Hook for navigation

  const onDrop = (acceptedFiles) => {
    setFiles(acceptedFiles);
  };

  const uploadFiles = async () => {
    if (!files.length) return alert("Please select a file!");

    setUploading(true);
    const formData = new FormData();
    formData.append("file", files[0]);

    try {
      const res = await axios.post(
       `${API_BASE_URL}/api/pdf/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
    console.log("Upload success:", res.data);

      // ✅ Save file URL in localStorage and navigate to Chat page
      localStorage.setItem("fileUrl", res.data.fileUrl);
      console.log("File URL saved in localStorage:", res.data.fileUrl);
      navigate("/chat");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("File upload failed!");
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "application/pdf": [".pdf"] },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center p-8 justify-center w-full max-w-md h-auto border-2 border-dashed border-gray-400 rounded-lg">
        <div
          {...getRootProps()}
          className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
        >
          <input {...getInputProps()} />
          <p className="text-gray-700 text-lg">
            Drag & Drop or{" "}
            <span className="text-blue-500 font-semibold">
              {" "}
              Click to Browse
            </span>
          </p>
          <p className="text-sm text-gray-500">(Only PDF files allowed)</p>
        </div>

        {files.length > 0 && (
          <div className="mt-3 text-gray-700">
            <p>Selected: {files[0].name}</p>
            <button
              onClick={uploadFiles}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload File"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
