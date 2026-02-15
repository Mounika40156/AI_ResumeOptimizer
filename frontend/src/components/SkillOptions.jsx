// frontend/src/components/SkillOptions.js

import React, { useState } from "react";
import { Download, Eye, ArrowLeft, AlertCircle, Loader } from "lucide-react";
import {
  generateEnhancedResume,
  downloadFile,
} from "../services/ResumeApi";

/**
 * Shows two options after skills are detected:
 * 1. Download updated resume with recommendations
 * 2. Just view missing skills
 */
const SkillOptions = ({
  file,
  profileLevel = "mid",
  skillAnalysis,
  analysisResults,
  onViewMissingSkills,
  onBack,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadUpdatedResume = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      // Get job description from analysisResults
      const jobDescription = analysisResults?.jobDescription || "";

      const result = await generateEnhancedResume(file, profileLevel, jobDescription);

      if (result.success && result.data && result.data.downloadUrl) {
        downloadFile(
          result.data.downloadUrl,
          result.data.enhancedResumeFileName
        );
        setDownloadSuccess(true);

        // Show success message for 2 seconds, then close
        setTimeout(() => {
          setDownloadSuccess(false);
        }, 2000);
      }
    } catch (err) {
      console.error("Download error:", err);
      setError(err.message || "Failed to generate resume");
    } finally {
      setIsGenerating(false);
    }
  };

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
        
        .animate-in {
          animation: slideIn 0.5s ease-out forwards;
        }

        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      <div className="max-w-2xl mx-auto px-6">
        {/* BACK BUTTON */}
        <button
          onClick={onBack}
          className="mb-8 inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors font-medium text-sm"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* HEADER */}
        <div className="mb-12 animate-in">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
            What Would You Like to Do?
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Choose how you want to use your skill analysis
          </p>
        </div>

        {/* ERROR ALERT */}
        {error && (
          <div className="mb-8 flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <p className="text-red-800 dark:text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* TWO OPTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in">
          {/* OPTION 1: DOWNLOAD UPDATED RESUME */}
          <button
            onClick={handleDownloadUpdatedResume}
            disabled={isGenerating}
            className="card-hover group p-8 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl text-left hover:border-blue-400 dark:hover:border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-950/30 rounded-xl group-hover:bg-blue-200 dark:group-hover:from-blue-900/50 transition-colors">
                <Download className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              {downloadSuccess && (
                <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
                  ✓ Downloaded
                </span>
              )}
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Download Updated Resume
            </h3>

            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
              Get your resume with recommended skills added to it. This is a new
              file that combines your original resume with skill recommendations.
            </p>

            {/* FEATURES LIST */}
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
                Original content preserved
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
                Recommended skills added
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
                PDF format ready to submit
              </li>
            </ul>

            {/* BUTTON */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-500 font-medium">
                {isGenerating ? "Generating..." : "Ready to download"}
              </span>
              {isGenerating && <Loader size={16} className="animate-spin text-blue-600" />}
            </div>
          </button>

          {/* OPTION 2: VIEW MISSING SKILLS */}
          <button
            onClick={onViewMissingSkills}
            disabled={isGenerating}
            className="card-hover group p-8 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl text-left hover:border-orange-400 dark:hover:border-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-950/30 rounded-xl group-hover:bg-orange-200 dark:group-hover:from-orange-900/50 transition-colors">
                <Eye className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              View Missing Skills
            </h3>

            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
              See a detailed breakdown of skills you should develop based on
              your profile level. No files are created or downloaded.
            </p>

            {/* FEATURES LIST */}
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <span className="w-1.5 h-1.5 bg-orange-600 dark:bg-orange-400 rounded-full"></span>
                Skills by category
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <span className="w-1.5 h-1.5 bg-orange-600 dark:bg-orange-400 rounded-full"></span>
                Learning recommendations
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <span className="w-1.5 h-1.5 bg-orange-600 dark:bg-orange-400 rounded-full"></span>
                No downloads required
              </li>
            </ul>

            {/* BUTTON */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-500 font-medium">
                View detailed skills
              </span>
              <span className="text-orange-600 dark:text-orange-400 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </button>
        </div>

        {/* INFO BOX */}
        <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            💡 Not sure which option?
          </h4>
          <p className="text-blue-800 dark:text-blue-300 text-sm">
            Choose <strong>Download Updated Resume</strong> if you want to
            submit an enhanced version of your resume to employers. Choose{" "}
            <strong>View Missing Skills</strong> if you want to understand what
            you should learn next.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SkillOptions;