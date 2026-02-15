// frontend/src/services/resumeApi.js

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

/**
 * Analyze resume and extract skills
 */
export const analyzeResume = async (file, profileLevel = "mid") => {
  try {
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("profileLevel", profileLevel);

    const response = await fetch(`${API_URL}/api/resume/analyze`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to analyze resume");
    }

    return await response.json();
  } catch (error) {
    console.error("Resume analysis error:", error);
    throw error;
  }
};

/**
 * Get skill recommendations (JSON format)
 */
export const getRecommendations = async (file, profileLevel = "mid") => {
  try {
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("profileLevel", profileLevel);

    const response = await fetch(`${API_URL}/api/resume/recommendations`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to get recommendations");
    }

    return await response.json();
  } catch (error) {
    console.error("Recommendations error:", error);
    throw error;
  }
};

/**
 * Generate enhanced resume PDF
 * @param {File} file - Resume file
 * @param {string} profileLevel - Profile level (junior, mid, senior)
 * @param {string} jobDescription - Job description for context
 */
export const generateEnhancedResume = async (file, profileLevel = "mid", jobDescription = "") => {
  try {
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("profileLevel", profileLevel);
    formData.append("jobDescription", jobDescription);

    console.log("Generating enhanced resume with jobDescription:", jobDescription ? "✓ Provided" : "✗ Not provided");

    const response = await fetch(`${API_URL}/api/resume/generate-enhanced`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to generate enhanced resume");
    }

    return await response.json();
  } catch (error) {
    console.error("Enhanced resume generation error:", error);
    throw error;
  }
};

/**
 * Generate recommendation PDF
 * @param {File} file - Resume file
 * @param {string} profileLevel - Profile level (junior, mid, senior)
 * @param {string} jobDescription - Job description for context
 */
export const generateRecommendationPDF = async (file, profileLevel = "mid", jobDescription = "") => {
  try {
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("profileLevel", profileLevel);
    formData.append("jobDescription", jobDescription);

    console.log("Generating recommendation PDF with jobDescription:", jobDescription ? "✓ Provided" : "✗ Not provided");

    const response = await fetch(
      `${API_URL}/api/resume/generate-recommendation-pdf`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to generate recommendation PDF");
    }

    return await response.json();
  } catch (error) {
    console.error("Recommendation PDF generation error:", error);
    throw error;
  }
};

/**
 * Download file from server
 */
export const downloadFile = (downloadUrl, fileName) => {
  const link = document.createElement("a");
  link.href = `${API_URL}${downloadUrl}`;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};