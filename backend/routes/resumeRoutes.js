const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const { parseResume, cleanResumeText } = require('../utils/parseResume');
const { extractSkills, generateSkillAnalysis } = require('../utils/skillExtractor');
const { 
  generateEnhancedResume, 
  generateSkillsRecommendationFile,
  generateSkillsReport 
} = require('../utils/resumeGenerator');

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/resumes');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, DOCX, and TXT files are allowed'));
    }
  }
});

/**
 * Safe skill extraction - always returns array
 */
const safeExtractSkills = (text) => {
  try {
    const skills = extractSkills(text);
    
    // If already an array, return it
    if (Array.isArray(skills)) {
      return skills;
    }
    
    // If it's an object, extract all values into an array
    if (typeof skills === 'object' && skills !== null) {
      const allSkills = [];
      for (const value of Object.values(skills)) {
        if (Array.isArray(value)) {
          allSkills.push(...value);
        } else if (typeof value === 'string') {
          allSkills.push(value);
        }
      }
      return allSkills;
    }
    
    // Fallback to empty array
    return [];
  } catch (error) {
    console.error('Error extracting skills:', error);
    return [];
  }
};

/**
 * @route   POST /api/analyze
 * @desc    Analyze resume vs job description
 * @access  Public
 */
router.post('/analyze', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const profileLevel = req.body.profileLevel || 'mid';
    const { jobDescription } = req.body;

    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({ 
        error: 'Job description is required for analysis' 
      });
    }

    console.log('📄 Parsing resume...');

    // Parse resume
    const resumeText = await parseResume(filePath);
    const cleanedText = cleanResumeText(resumeText);

    console.log('🔍 Extracting skills...');

    // Extract skills from resume - USING SAFE FUNCTION
    const extractedSkills = safeExtractSkills(cleanedText);

    // Extract skills from job description - USING SAFE FUNCTION
    const jobDescriptionSkills = safeExtractSkills(jobDescription);

    console.log(`Found ${extractedSkills.length} skills in resume`);
    console.log(`Found ${jobDescriptionSkills.length} skills in JD`);

    // Compare and find matched vs missing skills
    const matchedSkills = extractedSkills.filter(skill => 
      jobDescriptionSkills.some(jdSkill => 
        jdSkill && skill && jdSkill.toLowerCase() === skill.toLowerCase()
      )
    );

    const missingSkills = jobDescriptionSkills.filter(skill => 
      !extractedSkills.some(resumeSkill => 
        resumeSkill && skill && resumeSkill.toLowerCase() === skill.toLowerCase()
      )
    );

    console.log(`Matched ${matchedSkills.length} skills`);
    console.log(`Missing ${missingSkills.length} skills`);

    // Generate skill analysis
    const skillAnalysis = generateSkillAnalysis(extractedSkills, profileLevel);

    console.log('✅ Analysis complete');

    // Return comprehensive analysis
    res.json({
      success: true,
      analysis: {
        matchedSkills: matchedSkills || [],
        missingSkills: missingSkills || [],
        totalJobSkills: jobDescriptionSkills.length,
        matchPercentage: jobDescriptionSkills.length > 0 
          ? Math.round((matchedSkills.length / jobDescriptionSkills.length) * 100)
          : 0,
        
        skills: skillAnalysis,
        
        recommendations: [
          'Review the job description requirements carefully',
          'Add relevant skills to your resume',
          'Highlight achievements with metrics'
        ]
      },
      resumeText: resumeText,
      jobDescription: jobDescription,
      metadata: {
        resumeFileName: req.file.filename,
        filePath: filePath,
        profileLevel: profileLevel,
        analyzedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Resume analysis error:', error);
    res.status(500).json({ 
      error: error.message || 'Error analyzing resume'
    });
  }
});

/**
 * @route   POST /api/resume/generate-enhanced
 * @desc    Generate enhanced resume PDF
 * @access  Public
 */
router.post('/generate-enhanced', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const profileLevel = req.body.profileLevel || 'mid';
    const { jobDescription } = req.body;

    if (!jobDescription) {
      return res.status(400).json({ error: 'Job description required' });
    }

    console.log('📄 Generating enhanced resume PDF...');

    // Parse resume
    const resumeText = await parseResume(filePath);
    const cleanedText = cleanResumeText(resumeText);

    // Extract skills - USING SAFE FUNCTION
    const extractedSkills = safeExtractSkills(cleanedText);
    const jobDescriptionSkills = safeExtractSkills(jobDescription);

    console.log(`Resume has ${extractedSkills.length} skills`);
    console.log(`JD has ${jobDescriptionSkills.length} skills`);

    // Find missing skills (what they should develop)
    const missingSkills = jobDescriptionSkills.filter(skill => 
      !extractedSkills.some(resumeSkill => 
        resumeSkill && skill && resumeSkill.toLowerCase() === skill.toLowerCase()
      )
    );

    console.log(`Adding ${missingSkills.length} recommended skills to PDF`);

    // Generate skill analysis with missing skills
    const skillAnalysis = generateSkillAnalysis(extractedSkills, profileLevel);
    
    // Add missing skills to skillAnalysis for PDF generation
    if (missingSkills.length > 0) {
      skillAnalysis.missingSkills = skillAnalysis.missingSkills || {};
      skillAnalysis.missingSkills['Recommended'] = missingSkills;
    }

    // Generate enhanced resume PDF
    const uploadsDir = path.join(__dirname, '../uploads/resumes');
    const enhancedResumePath = await generateEnhancedResume(
      resumeText,
      skillAnalysis,
      uploadsDir
    );

    const fileName = path.basename(enhancedResumePath);

    console.log('✅ Enhanced resume PDF generated successfully');

    res.json({
      success: true,
      data: {
        message: 'Enhanced resume generated successfully',
        enhancedResumeFileName: fileName,
        downloadUrl: `/api/resume/download/${fileName}`,
        skills: skillAnalysis
      }
    });

  } catch (error) {
    console.error('Resume generation error:', error);
    res.status(500).json({ 
      error: error.message || 'Error generating enhanced resume'
    });
  }
});

/**
 * @route   POST /api/resume/recommendations
 * @desc    Get skill recommendations
 * @access  Public
 */
router.post('/recommendations', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const profileLevel = req.body.profileLevel || 'mid';

    // Parse and analyze
    const resumeText = await parseResume(filePath);
    const cleanedText = cleanResumeText(resumeText);
    const extractedSkills = safeExtractSkills(cleanedText);
    const skillAnalysis = generateSkillAnalysis(extractedSkills, profileLevel);

    // Generate report
    const report = generateSkillsReport(skillAnalysis, profileLevel);

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ 
      error: error.message || 'Error generating recommendations'
    });
  }
});

/**
 * @route   POST /api/resume/generate-recommendation-pdf
 * @desc    Generate recommendation PDF file
 * @access  Public
 */
router.post('/generate-recommendation-pdf', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const profileLevel = req.body.profileLevel || 'mid';

    // Parse and analyze
    const resumeText = await parseResume(filePath);
    const cleanedText = cleanResumeText(resumeText);
    const extractedSkills = safeExtractSkills(cleanedText);
    const skillAnalysis = generateSkillAnalysis(extractedSkills, profileLevel);

    // Generate recommendation PDF
    const uploadsDir = path.join(__dirname, '../uploads/resumes');
    const recommendationPath = await generateSkillsRecommendationFile(
      skillAnalysis,
      uploadsDir,
      profileLevel
    );

    const fileName = path.basename(recommendationPath);

    res.json({
      success: true,
      data: {
        message: 'Recommendation PDF generated successfully',
        recommendationFileName: fileName,
        downloadUrl: `/api/resume/download/${fileName}`,
        skills: skillAnalysis
      }
    });
  } catch (error) {
    console.error('Recommendation PDF generation error:', error);
    res.status(500).json({ 
      error: error.message || 'Error generating recommendation PDF'
    });
  }
});

/**
 * @route   GET /api/resume/download/:filename
 * @desc    Download generated resume or recommendation file
 * @access  Public
 */
router.get('/download/:filename', (req, res) => {
  try {
    const fileName = req.params.filename;
    const filePath = path.join(__dirname, '../uploads/resumes', fileName);

    // Security: prevent directory traversal
    if (!filePath.startsWith(path.join(__dirname, '../uploads/resumes'))) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.download(filePath, fileName);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ 
      error: 'Error downloading file'
    });
  }
});

module.exports = router;