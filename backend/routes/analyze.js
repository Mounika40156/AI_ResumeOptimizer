const express = require("express");
const router = express.Router();
const multer = require("multer");
const { analyzeWithAI } = require("../utils/aiPrompt");
const { extractText } = require("../utils/extractText");

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

// POST route - handles file upload
router.post("/", upload.single("resume"), async (req, res) => {
  try {
    // Validate inputs
    if (!req.file) {
      return res.status(400).json({ error: "Resume file is required" });
    }

    const { jobDescription } = req.body;
    if (!jobDescription || jobDescription.trim().length === 0) {
      return res.status(400).json({ error: "Job description is required" });
    }

    // Extract text from resume file
    const resumeText = await extractText(req.file.buffer, req.file.mimetype);

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ error: "Could not extract text from resume" });
    }

    // Analyze with AI
    const result = await analyzeWithAI(resumeText, jobDescription);

    // Return results
    res.json({
      success: true,
      analysis: result,
      resumeText: resumeText,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "AI analysis failed" });
  }
});

module.exports = router;