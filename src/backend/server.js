const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer storage for PDF upload
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// 📄 File upload endpoint
app.post("/api/pdf/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
  res.json({ fileUrl });
});

// 💬 Chat endpoint — ADD THIS BELOW 👇
app.post("/api/chat", (req, res) => {
  const { message, fileUrl } = req.body;

  if (!message || !fileUrl) {
    return res.status(400).json({ error: "Missing message or fileUrl" });
  }

  const reply = `You asked: "${message}" about the file: ${fileUrl}`;
  res.json({ reply });
});

// ✅ Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
