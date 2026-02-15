import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Loader,
} from "lucide-react";
import { analyzeResume } from "../services/ResumeApi";
import SkillOptions from "./SkillOptions";
import AnalysisResults from "./AnalysisResults";

const ResumeUpload = ({ onBack, onSuccess }) => {
  // ===== STATE VARIABLES =====
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [showJD, setShowJD] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);

  // NEW STATE VARIABLES FOR SKILL OPTIONS
  const [showSkillOptions, setShowSkillOptions] = useState(false);
  const [currentSkillAnalysis, setCurrentSkillAnalysis] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [profileLevel, setProfileLevel] = useState("mid");
  const [showAnalysisResults, setShowAnalysisResults] = useState(false);

  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

  // ===== FUNCTIONS =====

  // More flexible file type checking
  const validateFile = (file) => {
    if (file.size > MAX_FILE_SIZE) {
      setUploadStatus("error");
      setAnalysisError("File size exceeds 5MB limit");
      return false;
    }

    // Check by file extension as well as MIME type
    const fileName = file.name.toLowerCase();
    const validExtensions = [".pdf", ".doc", ".docx"];
    const hasValidExtension = validExtensions.some((ext) =>
      fileName.endsWith(ext)
    );

    const validMimeTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const hasValidMimeType = validMimeTypes.includes(file.type);

    // Accept if either extension OR mime type is valid
    if (!hasValidExtension && !hasValidMimeType) {
      setUploadStatus("error");
      setAnalysisError("Invalid file type. Only PDF, DOC, and DOCX are allowed.");
      return false;
    }

    return true;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      if (validateFile(files[0])) {
        setFile(files[0]);
        setUploadStatus(null);
        setAnalysisError(null);
      }
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      if (validateFile(files[0])) {
        setFile(files[0]);
        setUploadStatus(null);
        setAnalysisError(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + Math.random() * 30;
      });
    }, 300);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      setIsUploading(false);
      setUploadStatus("success");
    }, 2000);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setUploadProgress(0);
    setUploadStatus(null);
    setAnalysisError(null);
  };

  const handleJobDescriptionChange = (e) => {
    setJobDescription(e.target.value);
    setCharCount(e.target.value.length);
  };

  // ============================================================
  // MAIN ANALYSIS FUNCTION - Calls Backend API with Resume + JD
  // ============================================================
  const handleAnalyze = async () => {
    if (!file || !jobDescription.trim()) {
      setAnalysisError("Please provide both resume and job description");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jobDescription);

      console.log("Sending request to:", `${API_URL}/api/analyze`);
      console.log("File:", file.name, file.type, file.size);

      // Call backend API
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.error || "Analysis failed");
      }

      const result = await response.json();
      console.log("Analysis result:", result);

      // ============================================================
      // Extract skills and show SkillOptions
      // ============================================================
      // Always show SkillOptions with analysis results
      setAnalysisResults({
        resumeFile: file,
        jobDescription: jobDescription,
        analysis: result.analysis,
        resumeText: result.resumeText,
      });

      // Set the analysis data (works with any structure)
      setCurrentSkillAnalysis(result.analysis);
      setShowSkillOptions(true);

      console.log("✅ Showing SkillOptions with analysis:", result.analysis);
    } catch (error) {
      console.error("Analysis error:", error);
      setAnalysisError(
        error.message || "Failed to analyze resume. Please try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  /* ========== ANALYSIS RESULTS SCREEN ========== */
  if (showAnalysisResults && analysisResults) {
    return (
      <AnalysisResults
        data={analysisResults}
        onBack={() => {
          setShowAnalysisResults(false);
          setShowSkillOptions(true);
        }}
      />
    );
  }

  /* ========== SKILL OPTIONS SCREEN ========== */
  if (showSkillOptions && analysisResults) {
    return (
      <SkillOptions
        file={file}
        profileLevel={profileLevel}
        skillAnalysis={analysisResults.analysis}
        analysisResults={analysisResults}
        onViewMissingSkills={() => {
          setShowSkillOptions(false);
          setShowAnalysisResults(true);
        }}
        onBack={() => {
          setShowSkillOptions(false);
          setCurrentSkillAnalysis(null);
          setAnalysisResults(null);
          setShowJD(false);
          setJobDescription("");
          setCharCount(0);
          setUploadStatus(null);
        }}
      />
    );
  }

  /* ========== JOB DESCRIPTION SCREEN ========== */
  if (showJD) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 pt-24 pb-16">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&display=swap');
          * { font-family: 'Sora', sans-serif; }
          .input-focus:focus-within {
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1), 0 0 20px rgba(59, 130, 246, 0.15);
          }
        `}</style>

        <div className="max-w-2xl mx-auto px-6">
          <button
            onClick={() => setShowJD(false)}
            className="mb-8 inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors font-medium text-sm"
          >
            <ArrowLeft size={18} />
            Back to Resume
          </button>

          <div className="mb-12">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
              Job Description
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Paste the job description to analyze your resume against the
              requirements
            </p>
          </div>

          <div className="input-focus bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Job Description
              </label>
              <span className="text-xs text-slate-500 dark:text-slate-500">
                {charCount} characters
              </span>
            </div>
            <textarea
              value={jobDescription}
              onChange={handleJobDescriptionChange}
              rows={12}
              placeholder="Paste the complete job description here..."
              className="w-full p-4 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 resize-none focus:outline-none text-base leading-relaxed"
              disabled={isAnalyzing}
            />
          </div>

          {/* ERROR ALERT */}
          {analysisError && (
            <div className="mt-6 flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-red-800 dark:text-red-300 text-sm">
                {analysisError}
              </p>
            </div>
          )}

          <button
            disabled={!jobDescription.trim() || isAnalyzing}
            onClick={handleAnalyze}
            className={`w-full mt-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 text-base flex items-center justify-center gap-2 ${
              jobDescription.trim() && !isAnalyzing
                ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl cursor-pointer"
                : "bg-slate-300 dark:bg-slate-700 cursor-not-allowed"
            }`}
          >
            {isAnalyzing && <Loader size={18} className="animate-spin" />}
            {isAnalyzing ? "Analyzing Resume..." : "Analyze Resume"}
          </button>
        </div>
      </div>
    );
  }

  /* ========== RESUME UPLOAD SCREEN ========== */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 pt-24 pb-16">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&display=swap');
        * { font-family: 'Sora', sans-serif; }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        .animate-in {
          animation: slideIn 0.5s ease-out forwards;
        }
        
        .animate-fade {
          animation: fadeIn 0.3s ease-out;
        }
        
        .upload-zone {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .upload-zone.active {
          border-color: rgb(59, 130, 246);
          background-color: rgba(59, 130, 246, 0.02);
          transform: scale(1.01);
        }
        
        .progress-bar {
          transition: width 0.3s ease-out;
          background: linear-gradient(90deg, rgb(59, 130, 246) 0%, rgb(37, 99, 235) 100%);
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
        }
      `}</style>

      <div className="max-w-2xl mx-auto px-6">
        <button
          onClick={onBack}
          className="mb-8 inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors font-medium text-sm"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="mb-12 animate-in">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
            Upload Your Resume
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Get AI-powered insights on how your resume matches job descriptions
          </p>
        </div>

        {uploadStatus !== "success" ? (
          <div className="space-y-6 animate-in">
            {/* UPLOAD ZONE */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`upload-zone border-2 border-dashed border-slate-300 dark:border-slate-700 p-12 text-center rounded-2xl cursor-pointer bg-white dark:bg-slate-900/50 backdrop-blur-sm ${
                dragActive ? "active" : ""
              }`}
            >
              {!file && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                  />

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="space-y-4"
                  >
                    <div className="flex justify-center">
                      <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-950/30 rounded-full">
                        <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-900 dark:text-white font-semibold text-lg">
                        Drop your resume here
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                        or click to browse your computer
                      </p>
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 pt-2">
                      PDF, DOC, or DOCX • Max 5MB
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* FILE PREVIEW */}
            {file && (
              <div className="animate-fade bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between transition-all hover:shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-950/30 rounded-xl">
                    <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                {!isUploading && (
                  <button
                    onClick={handleRemoveFile}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            )}

            {/* UPLOAD PROGRESS */}
            {isUploading && (
              <div className="animate-fade space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Uploading...
                  </span>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {Math.round(uploadProgress)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="progress-bar h-full rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* UPLOAD BUTTON */}
            {file && !isUploading && uploadStatus !== "success" && (
              <button
                onClick={handleUpload}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl animate-in"
              >
                Upload Resume
              </button>
            )}

            {/* ERROR STATE */}
            {uploadStatus === "error" && (
              <div className="animate-fade flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-red-900 dark:text-red-200 text-sm">
                    Invalid file
                  </p>
                  <p className="text-red-800 dark:text-red-300 text-xs mt-1">
                    {analysisError ||
                      "Please use PDF, DOC, or DOCX files under 5MB"}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          // SUCCESS STATE
          <div className="text-center space-y-8 animate-in">
            <div className="flex justify-center">
              <div className="p-6 bg-gradient-to-br from-green-100 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/20 rounded-full">
                <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Resume Uploaded Successfully
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-base">
                Now let's add a job description to optimize your resume
              </p>
            </div>

            {/* SINGLE BUTTON - Continue to Job Description */}
            <button
              onClick={() => setShowJD(true)}
              className="inline-block px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Continue to Job Description
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeUpload;