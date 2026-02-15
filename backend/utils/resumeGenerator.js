const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Extract user details
 */
const extractUserDetails = (resumeText) => {
  const lines = resumeText.split('\n').filter(line => line.trim());
  
  let details = {
    name: '',
    email: '',
    phone: '',
    portfolio: '',
    github: '',
    linkedin: ''
  };

  for (const line of lines) {
    const trimmed = line.trim();
    
    if (!details.name && trimmed.length > 3 && trimmed.length < 50 && 
        !trimmed.includes('@') && !trimmed.includes('http') && trimmed.match(/^[A-Za-z\s]+$/)) {
      details.name = trimmed;
    }
    
    if (!details.email && trimmed.includes('@')) {
      const emailMatch = trimmed.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      if (emailMatch) details.email = emailMatch[0];
    }
    
    if (!details.phone && (trimmed.includes('+91') || trimmed.match(/\d{10}/))) {
      const phoneMatch = trimmed.match(/(\+91|0)?[\s\-]?(\d{10}|\d{3}[\s\-]?\d{3}[\s\-]?\d{4})/);
      if (phoneMatch) details.phone = phoneMatch[0];
    }
    
    if (!details.portfolio && trimmed.toLowerCase().includes('portfolio')) {
      const urlMatch = trimmed.match(/(https?:\/\/)?[\w\.-]+\.\w+/);
      if (urlMatch) details.portfolio = urlMatch[0];
    }
    
    if (!details.github && trimmed.toLowerCase().includes('github')) {
      const urlMatch = trimmed.match(/(github\.com\/[\w\-]+|github\/[\w\-]+)/i);
      if (urlMatch) details.github = urlMatch[0];
    }
    
    if (!details.linkedin && trimmed.toLowerCase().includes('linkedin')) {
      const urlMatch = trimmed.match(/(linkedin\.com\/in\/[\w\-]+|linkedin\/[\w\-]+)/i);
      if (urlMatch) details.linkedin = urlMatch[0];
    }
  }

  return details;
};

/**
 * Extract sections from resume
 */
const extractResumeSections = (resumeText) => {
  const sections = {};
  const lines = resumeText.split('\n');
  
  let currentSection = null;
  let sectionContent = [];

  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed.match(/^(EDUCATION|EXPERIENCE|SKILLS|PROJECTS|CERTIFICATIONS|VOLUNTEER|ACHIEVEMENTS|LANGUAGES|AWARDS)/i)) {
      if (currentSection && sectionContent.length > 0) {
        sections[currentSection] = sectionContent.join('\n').trim();
      }
      currentSection = trimmed.toUpperCase();
      sectionContent = [];
    } else if (currentSection) {
      sectionContent.push(line);
    }
  }

  if (currentSection && sectionContent.length > 0) {
    sections[currentSection] = sectionContent.join('\n').trim();
  }

  return sections;
};

/**
 * Generate updated resume with skills integrated
 */
const generateEnhancedResume = async (originalResumeText, skillAnalysis, outputPath) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        margins: { top: 40, bottom: 40, left: 50, right: 50 }
      });

      const fileName = `enhanced_resume_${Date.now()}.pdf`;
      const fullPath = path.join(outputPath, fileName);
      const stream = fs.createWriteStream(fullPath);

      doc.pipe(stream);

      const userDetails = extractUserDetails(originalResumeText);
      const sections = extractResumeSections(originalResumeText);

      // ===== HEADER =====
      doc.fontSize(22).font('Helvetica-Bold').text(userDetails.name.toUpperCase());
      doc.moveDown(0.15);

      // Contact info
      let contactInfo = [];
      if (userDetails.phone) contactInfo.push(userDetails.phone);
      if (userDetails.email) contactInfo.push(userDetails.email);
      if (userDetails.portfolio) contactInfo.push(userDetails.portfolio);
      if (userDetails.github) contactInfo.push(userDetails.github);
      if (userDetails.linkedin) contactInfo.push(userDetails.linkedin);

      if (contactInfo.length > 0) {
        doc.fontSize(9).font('Helvetica').text(contactInfo.join(' | '));
      }

      // Separator line
      doc.moveTo(50, doc.y + 5).lineTo(550, doc.y + 5).stroke('#000000');
      doc.moveDown(1);

      // ===== SECTIONS =====
      const sectionOrder = ['EDUCATION', 'EXPERIENCE', 'SKILLS', 'PROJECTS', 'CERTIFICATIONS', 'VOLUNTEER', 'ACHIEVEMENTS', 'LANGUAGES'];

      for (const sectionName of sectionOrder) {
        if (sections[sectionName]) {
          // Section header
          doc.fontSize(11).font('Helvetica-Bold').text(sectionName);
          doc.moveDown(0.25);

          let sectionContent = sections[sectionName];

          // SPECIAL HANDLING FOR SKILLS - ADD RECOMMENDED SKILLS
          if (sectionName === 'SKILLS') {
            const missingSkills = skillAnalysis.missingSkills || {};
            
            // Display original skills first
            const skillsLines = sectionContent.split('\n').filter(line => line.trim());
            
            for (const line of skillsLines) {
              const trimmed = line.trim();
              
              if (!trimmed) continue;
              
              if (trimmed.match(/^[A-Za-z\s&]+:$/)) {
                doc.font('Helvetica-Bold').fontSize(10).text(trimmed);
                doc.moveDown(0.1);
              } else {
                doc.font('Helvetica').fontSize(9).text(trimmed);
                doc.moveDown(0.1);
              }
            }

            // Add recommended skills
            doc.moveDown(0.2);
            doc.font('Helvetica-Bold').fontSize(10).text('Updated Skills (Recommended):');
            doc.moveDown(0.1);

            for (const [category, skills] of Object.entries(missingSkills)) {
              if (Array.isArray(skills) && skills.length > 0) {
                doc.font('Helvetica-Bold').fontSize(10).text(`${category}:`);
                doc.font('Helvetica').fontSize(9).text(skills.join(' • '));
                doc.moveDown(0.15);
              }
            }
          }
          // FOR OTHER SECTIONS - DISPLAY NORMALLY
          else {
            const sectionLines = sectionContent.split('\n').filter(line => line.trim());
            
            for (const line of sectionLines) {
              const trimmed = line.trim();
              
              if (!trimmed) {
                continue;
              }

              // Bold for company/school/project names
              if (trimmed.match(/^[A-Z][a-zA-Z0-9\s&,\-\.]+$/) && trimmed.length > 5 && trimmed.length < 100 && !trimmed.includes(':')) {
                doc.font('Helvetica-Bold').fontSize(10).text(trimmed);
                doc.moveDown(0.1);
              }
              // Dates
              else if (trimmed.match(/\d{4}/) || trimmed.includes('—') || (trimmed.includes('-') && trimmed.match(/\d{4}/))) {
                doc.font('Helvetica').fontSize(9).text(trimmed);
                doc.moveDown(0.1);
              }
              // Category headers
              else if (trimmed.match(/^[A-Za-z\s&]+:$/)) {
                doc.font('Helvetica-Bold').fontSize(10).text(trimmed);
                doc.moveDown(0.08);
              }
              // Bullet points
              else if (trimmed.match(/^[•◦\-]\s/) || trimmed.match(/^\s+[•◦\-]/)) {
                doc.font('Helvetica').fontSize(9).text(trimmed, { indent: 15 });
                doc.moveDown(0.12);
              }
              // Regular text
              else {
                doc.font('Helvetica').fontSize(9).text(trimmed);
                doc.moveDown(0.1);
              }
            }
          }

          doc.moveDown(0.35);
        }
      }

      // ===== FOOTER =====
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke('#cccccc');
      doc.moveDown(0.3);
      doc.fontSize(8).font('Helvetica').text(
        `Updated Resume with Recommended Skills | ${new Date().toLocaleDateString()}`,
        { align: 'center', color: '#666666' }
      );

      doc.end();

      stream.on('finish', () => {
        console.log('✅ Enhanced Resume PDF Generated:', fileName);
        resolve(fullPath);
      });

      stream.on('error', (err) => {
        console.error('Stream error:', err);
        reject(err);
      });

      doc.on('error', (err) => {
        console.error('Document error:', err);
        reject(err);
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      reject(error);
    }
  });
};

/**
 * Generate skills recommendation document
 */
const generateSkillsRecommendationFile = async (skillAnalysis, outputPath, profileLevel = 'mid') => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });

      const fileName = `skill_recommendations_${Date.now()}.pdf`;
      const fullPath = path.join(outputPath, fileName);
      const stream = fs.createWriteStream(fullPath);

      doc.pipe(stream);

      doc.fontSize(20).font('Helvetica-Bold').text('SKILL DEVELOPMENT ROADMAP');
      doc.fontSize(10).font('Helvetica').text(`Level: ${profileLevel.toUpperCase()}`);
      doc.moveTo(50, doc.y + 3).lineTo(550, doc.y + 3).stroke('#000000');
      doc.moveDown(0.8);

      const totalSkillsFound = skillAnalysis.totalSkillsFound || 0;
      let totalMissing = 0;
      const missingSkills = skillAnalysis.missingSkills || {};
      
      for (const missing of Object.values(missingSkills)) {
        if (Array.isArray(missing)) {
          totalMissing += missing.length;
        }
      }

      const intro = `You currently have ${totalSkillsFound} skills. To advance as a ${profileLevel}-level professional, develop ${totalMissing} additional skills.`;
      doc.fontSize(10).font('Helvetica').text(intro, { width: 465 });
      doc.moveDown(0.8);

      doc.fontSize(11).font('Helvetica-Bold').text('SKILLS TO DEVELOP');
      doc.moveDown(0.3);

      for (const [category, skills] of Object.entries(missingSkills)) {
        if (Array.isArray(skills) && skills.length > 0) {
          doc.fontSize(10).font('Helvetica-Bold').text(`${category}:`);
          doc.fontSize(9).font('Helvetica').text(skills.join(' • '));
          doc.moveDown(0.4);
        }
      }

      doc.fontSize(11).font('Helvetica-Bold').text('YOUR CURRENT STRENGTHS');
      doc.moveDown(0.3);

      const detectedSkills = skillAnalysis.detectedSkills || {};
      for (const [category, skills] of Object.entries(detectedSkills)) {
        if (Array.isArray(skills) && skills.length > 0) {
          doc.fontSize(10).font('Helvetica-Bold').text(`${category}:`);
          doc.fontSize(9).font('Helvetica').text(skills.join(' • '));
          doc.moveDown(0.4);
        }
      }

      doc.end();

      stream.on('finish', () => {
        console.log('✅ Recommendation PDF Generated:', fileName);
        resolve(fullPath);
      });

      stream.on('error', (err) => {
        reject(err);
      });

      doc.on('error', (err) => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
};

const generateSkillsReport = (skillAnalysis, profileLevel = 'mid') => {
  return {
    timestamp: new Date().toISOString(),
    profileLevel,
    summary: {
      totalSkillsFound: skillAnalysis.totalSkillsFound || 0,
      totalSkillsToLearn: Object.values(skillAnalysis.missingSkills || {}).flat().length
    },
    detectedSkills: skillAnalysis.detectedSkills || {},
    missingSkills: skillAnalysis.missingSkills || {}
  };
};

module.exports = {
  generateEnhancedResume,
  generateSkillsRecommendationFile,
  generateSkillsReport
};