const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

/**
 * Parse resume file (PDF or DOCX) and extract text
 * @param {string} filePath - Path to resume file
 * @returns {Promise<string>} - Extracted text from resume
 */
const parseResume = async (filePath) => {
  try {
    const ext = path.extname(filePath).toLowerCase();

    if (ext === '.pdf') {
      return await parsePDF(filePath);
    } else if (ext === '.docx') {
      return await parseDOCX(filePath);
    } else if (ext === '.txt') {
      return parseTXT(filePath);
    } else {
      throw new Error('Unsupported file format. Please upload PDF, DOCX, or TXT');
    }
  } catch (error) {
    throw new Error(`Error parsing resume: ${error.message}`);
  }
};

/**
 * Parse PDF file
 */
const parsePDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    throw new Error(`PDF parsing failed: ${error.message}`);
  }
};

/**
 * Parse DOCX file
 */
const parseDOCX = async (filePath) => {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    throw new Error(`DOCX parsing failed: ${error.message}`);
  }
};

/**
 * Parse plain text file
 */
const parseTXT = (filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    throw new Error(`Text file parsing failed: ${error.message}`);
  }
};

/**
 * Clean and normalize resume text
 */
const cleanResumeText = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s.,-]/g, '') // Remove special characters
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
};

module.exports = {
  parseResume,
  cleanResumeText,
};