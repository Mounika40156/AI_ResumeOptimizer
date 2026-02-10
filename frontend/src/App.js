import React, { useState } from "react";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import ResumeUpload from "./components/ResumeUpload";
import AnalysisResults from "./components/AnalysisResults";
import "./App.css";

function App() {
  const [currentScreen, setCurrentScreen] = useState("home"); // "home", "upload", "results"
  const [analysisData, setAnalysisData] = useState(null);

  // Navigation handler for all screens
  const handleNavigation = (screen) => {
    setCurrentScreen(screen);
    window.scrollTo(0, 0);
  };

  // Get Started from HomePage
  const handleGoToAnalyzer = () => {
    setCurrentScreen("upload");
    window.scrollTo(0, 0);
  };

  // After analysis success
  const handleAnalysisSuccess = (data) => {
    setAnalysisData(data);
    setCurrentScreen("results");
    window.scrollTo(0, 0);
  };

  // Back to Home from Upload
  const handleBackToHome = () => {
    setCurrentScreen("home");
    setAnalysisData(null);
    window.scrollTo(0, 0);
  };

  // Back to Upload from Results
  const handleBackToUpload = () => {
    setCurrentScreen("upload");
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* NAVBAR - Always visible on every page */}
      <Navbar onNavigate={handleNavigation} currentScreen={currentScreen} />

      {/* PAGE CONTENT */}
      {currentScreen === "home" && (
        <HomePage onGetStarted={handleGoToAnalyzer} />
      )}

      {currentScreen === "upload" && (
        <ResumeUpload
          onBack={handleBackToHome}
          onSuccess={handleAnalysisSuccess}
        />
      )}

      {currentScreen === "results" && (
        <AnalysisResults
          data={analysisData}
          onBack={handleBackToUpload}
        />
      )}
    </div>
  );
}

export default App;