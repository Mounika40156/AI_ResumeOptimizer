const express = require("express");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();

const analyzeRoute = require("./routes/analyze");
const { extractText } = require("./utils/extractText");

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF, DOC, and DOCX are allowed."));
    }
  },
});

// Route for file upload + analysis
app.post("/api/analyze", upload.single("resume"), async (req, res) => {
  try {
    // Validate inputs
    if (!req.file) {
      return res.status(400).json({ error: "Resume file is required" });
    }

    const { jobDescription } = req.body;
    if (!jobDescription || jobDescription.trim().length === 0) {
      return res.status(400).json({ error: "Job description is required" });
    }

    // Extract text from resume
    const resumeText = await extractText(req.file.buffer, req.file.mimetype);

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ error: "Could not extract text from resume" });
    }

    // Analyze resume against job description
    const { analyzeWithAI } = require("./utils/aiPrompt");
    const analysis = await analyzeWithAI(resumeText, jobDescription);

    // Return comprehensive analysis
    res.json({
      success: true,
      analysis,
      resumeText,
    });
  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({
      error: error.message || "Failed to analyze resume",
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Resume Analyzer API is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File size exceeds 5MB limit" });
    }
  }

  res.status(500).json({
    error: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✓ Resume Analyzer API running on port ${PORT}`);
console.log(`✓ Groq API Key configured: ${process.env.GROQ_API_KEY ? "Yes" : "No"}`);
});