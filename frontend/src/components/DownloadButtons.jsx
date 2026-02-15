// frontend/src/components/Resume/DownloadButtons.js

import React, { useState } from "react";
import { Download, FileText, Zap, Loader, AlertCircle } from "lucide-react";
import {
  generateEnhancedResume,
  generateRecommendationPDF,
  downloadFile,
} from "../services/ResumeApi";

const DownloadButtons = ({ file, profileLevel, analysisResults }) => {
  const [downloadState, setDownloadState] = useState({
    enhanced: null,
    recommendations: null,
  });

  const [errors, setErrors] = useState({});

  const handleDownloadEnhanced = async () => {
    try {
      setDownloadState((prev) => ({ ...prev, enhanced: "loading" }));
      setErrors((prev) => ({ ...prev, enhanced: null }));

      // Pass jobDescription to the function
      const jobDescription = analysisResults?.jobDescription || "";
      const result = await generateEnhancedResume(file, profileLevel, jobDescription);

      if (result.data && result.data.downloadUrl) {
        downloadFile(result.data.downloadUrl, result.data.enhancedResumeFileName);
        setDownloadState((prev) => ({ ...prev, enhanced: "success" }));
      }
    } catch (error) {
      console.error("Download enhanced resume error:", error);
      setErrors((prev) => ({
        ...prev,
        enhanced: error.message || "Failed to download enhanced resume",
      }));
      setDownloadState((prev) => ({ ...prev, enhanced: "error" }));
    }
  };

  const handleDownloadRecommendations = async () => {
    try {
      setDownloadState((prev) => ({ ...prev, recommendations: "loading" }));
      setErrors((prev) => ({ ...prev, recommendations: null }));

      // Pass jobDescription to the function
      const jobDescription = analysisResults?.jobDescription || "";
      const result = await generateRecommendationPDF(file, profileLevel, jobDescription);

      if (result.data && result.data.downloadUrl) {
        downloadFile(
          result.data.downloadUrl,
          result.data.recommendationFileName
        );
        setDownloadState((prev) => ({ ...prev, recommendations: "success" }));
      }
    } catch (error) {
      console.error("Download recommendations error:", error);
      setErrors((prev) => ({
        ...prev,
        recommendations:
          error.message || "Failed to download recommendations",
      }));
      setDownloadState((prev) => ({ ...prev, recommendations: "error" }));
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
        📥 Download Options
      </h3>

      {/* ENHANCED RESUME BUTTON */}
      <button
        onClick={handleDownloadEnhanced}
        disabled={downloadState.enhanced === "loading"}
        className={`w-full p-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 text-base ${
          downloadState.enhanced === "loading"
            ? "bg-slate-300 dark:bg-slate-700 cursor-not-allowed"
            : downloadState.enhanced === "success"
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl"
        }`}
      >
        {downloadState.enhanced === "loading" ? (
          <>
            <Loader size={20} className="animate-spin" />
            Generating...
          </>
        ) : downloadState.enhanced === "success" ? (
          <>
            <FileText size={20} />
            Downloaded! ✓
          </>
        ) : (
          <>
            <Download size={20} />
            Download Enhanced Resume
          </>
        )}
      </button>

      {/* ERROR: ENHANCED RESUME */}
      {errors.enhanced && (
        <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle size={18} className="text-red-600 dark:text-red-400" />
          <p className="text-red-700 dark:text-red-300 text-sm">
            {errors.enhanced}
          </p>
        </div>
      )}

      {/* RECOMMENDATIONS PDF BUTTON */}
      <button
        onClick={handleDownloadRecommendations}
        disabled={downloadState.recommendations === "loading"}
        className={`w-full p-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 text-base ${
          downloadState.recommendations === "loading"
            ? "bg-slate-300 dark:bg-slate-700 cursor-not-allowed"
            : downloadState.recommendations === "success"
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:from-orange-700 hover:to-amber-700 shadow-lg hover:shadow-xl"
        }`}
      >
        {downloadState.recommendations === "loading" ? (
          <>
            <Loader size={20} className="animate-spin" />
            Generating...
          </>
        ) : downloadState.recommendations === "success" ? (
          <>
            <Zap size={20} />
            Downloaded! ✓
          </>
        ) : (
          <>
            <Download size={20} />
            Download Skills Recommendations
          </>
        )}
      </button>

      {/* ERROR: RECOMMENDATIONS */}
      {errors.recommendations && (
        <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle size={18} className="text-red-600 dark:text-red-400" />
          <p className="text-red-700 dark:text-red-300 text-sm">
            {errors.recommendations}
          </p>
        </div>
      )}

      {/* INFO BOX */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          <strong>💡 Tip:</strong> The enhanced resume includes your current
          resume plus recommended skills. The recommendations PDF shows only the
          skills you should develop.
        </p>
      </div>
    </div>
  );
};

export default DownloadButtons;