import React, { useState } from "react";
import {
  ArrowLeft,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  Zap,
  Copy,
  Check,
} from "lucide-react";

const AnalysisResults = ({ data, onBack }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!data || !data.analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <button
            onClick={onBack}
            className="mb-8 inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors font-medium text-sm"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <p className="text-slate-600 dark:text-slate-400">No analysis data available</p>
        </div>
      </div>
    );
  }

  const { analysis } = data;
  const {
    matchPercentage,
    summary,
    requiredSkills,
    missingSkills,
    strengths,
    improvementAreas,
    recommendedChanges,
    overallFeedback,
  } = analysis;

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Color based on match percentage
  const getMatchColor = (percentage) => {
    if (percentage >= 80) return "text-green-600 dark:text-green-400";
    if (percentage >= 60) return "text-blue-600 dark:text-blue-400";
    if (percentage >= 40) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getImportanceColor = (importance) => {
    if (importance === "high") return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800";
    if (importance === "medium") return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
    return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800";
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
      `}</style>

      <div className="max-w-4xl mx-auto px-6">
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
            Resume Analysis Results
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            AI-powered insights
          </p>
        </div>

        {/* MATCH PERCENTAGE CARD */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 mb-8 animate-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-2">
                Resume Match Score
              </p>
              <div className={`text-5xl font-bold ${getMatchColor(matchPercentage)}`}>
                {matchPercentage}%
              </div>
            </div>
            <div className="text-right">
              <TrendingUp size={48} className={getMatchColor(matchPercentage)} />
            </div>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                matchPercentage >= 80
                  ? "bg-gradient-to-r from-green-500 to-emerald-500"
                  : matchPercentage >= 60
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                  : matchPercentage >= 40
                  ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                  : "bg-gradient-to-r from-red-500 to-pink-500"
              }`}
              style={{ width: `${matchPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 mb-8 animate-in">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Lightbulb size={24} className="text-blue-600 dark:text-blue-400" />
            Summary
          </h2>
          <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
            {summary}
          </p>
        </div>

        {/* STRENGTHS */}
        {strengths && strengths.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 mb-8 animate-in">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
              Your Strengths
            </h2>
            <div className="space-y-3">
              {strengths.map((strength, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                >
                  <CheckCircle size={20} className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                  <p className="text-slate-700 dark:text-slate-300">{strength}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MISSING SKILLS */}
        {missingSkills && missingSkills.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 mb-8 animate-in">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <AlertCircle size={24} className="text-red-600 dark:text-red-400" />
              Missing Skills ({missingSkills.length})
            </h2>
            <div className="space-y-4">
              {missingSkills.map((skill, idx) => (
                <div
                  key={idx}
                  className={`p-4 border rounded-lg ${getImportanceColor(skill.importance)}`}
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{skill.skill}</h3>
                      <p className={`text-sm font-medium mt-1`}>
                        Importance: {skill.importance.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm opacity-90 mt-2">{skill.suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REQUIRED SKILLS STATUS */}
        {requiredSkills && requiredSkills.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 mb-8 animate-in">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Required Skills Analysis
            </h2>
            <div className="space-y-3">
              {requiredSkills.map((skill, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border ${
                    skill.found
                      ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                      : "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className={`font-bold ${skill.found ? "text-green-700 dark:text-green-300" : "text-amber-700 dark:text-amber-300"}`}>
                          {skill.skill}
                        </p>
                        <span className={`text-xs font-medium px-2 py-1 rounded ${
                          skill.importance === "high"
                            ? "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300"
                            : skill.importance === "medium"
                            ? "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300"
                            : "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                        }`}>
                          {skill.importance}
                        </span>
                        <span className={`text-xs font-bold ${skill.found ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}`}>
                          {skill.found ? "✓ FOUND" : "✗ MISSING"}
                        </span>
                      </div>
                      <p className="text-sm mt-2 opacity-90 text-white">{skill.suggestion}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* IMPROVEMENT AREAS */}
        {improvementAreas && improvementAreas.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 mb-8 animate-in">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Zap size={24} className="text-yellow-600 dark:text-yellow-400" />
              Areas for Improvement
            </h2>
            <div className="space-y-4">
              {improvementAreas.map((area, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                    {area.area}
                  </h3>
                  <p className="text-sm text-slate-700 dark:text-slate-400 mb-2">
                    <span className="font-medium">Current:</span> {area.currentState}
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-400">
                    <span className="font-medium">Improvement:</span> {area.suggestion}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RECOMMENDED CHANGES */}
        {recommendedChanges && recommendedChanges.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 mb-8 animate-in">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Recommended Changes
            </h2>
            <div className="space-y-4">
              {recommendedChanges.map((change, idx) => (
                <div
                  key={idx}
                  className={`p-4 border rounded-lg ${
                    change.priority === "high"
                      ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                      : change.priority === "medium"
                      ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                      : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">
                        {change.sectionName}
                      </h3>
                      <span className={`inline-block text-xs font-bold mt-1 px-2 py-1 rounded ${
                        change.priority === "high"
                          ? "bg-red-200 dark:bg-red-900 text-red-700 dark:text-red-300"
                          : change.priority === "medium"
                          ? "bg-yellow-200 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
                          : "bg-blue-200 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                      }`}>
                        {change.priority} PRIORITY
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(change.change, idx)}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                      title="Copy to clipboard"
                    >
                      {copiedIndex === idx ? (
                        <Check size={18} className="text-green-600 dark:text-green-400" />
                      ) : (
                        <Copy size={18} className="text-slate-500 dark:text-slate-400" />
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                    {change.change}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    <span className="font-medium">Why:</span> {change.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OVERALL FEEDBACK */}
        {overallFeedback && (
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-8 mb-8 animate-in">
            <h2 className="text-2xl font-bold text-white mb-4">Final Feedback</h2>
            <p className="text-white text-base leading-relaxed opacity-95">
              {overallFeedback}
            </p>
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="flex gap-4 pt-8 animate-in">
          <button
            onClick={onBack}
            className="flex-1 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300"
          >
            Analyze Another Resume
          </button>
          <button
            onClick={() => window.print()}
            className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Print Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;