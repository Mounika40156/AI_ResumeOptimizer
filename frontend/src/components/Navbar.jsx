import React, { useState, useEffect } from "react";
import { HiDocumentCheck } from "react-icons/hi2";
import { Menu, X } from "lucide-react";

const Navbar = ({ onNavigate, currentScreen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  const navLinks = [
    { label: "Home", id: "hero" },
    { label: "Features", id: "features" },
    { label: "ATS Score", id: "ats" },
    { label: "How It Works", id: "how-it-works" },
    { label: "About", id: "about" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);

      // Update active section based on scroll position (only on home screen)
      if (currentScreen === "home") {
        for (let link of navLinks) {
          const element = document.getElementById(link.id);
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= 150 && rect.bottom > 150) {
              setActiveSection(link.id);
              break;
            }
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentScreen]);

  const handleSectionClick = (id) => {
    setActiveSection(id);
    setIsOpen(false);
    
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleLogoClick = () => {
    if (currentScreen !== "home") {
      onNavigate("home");
      setActiveSection("hero");
    } else {
      handleSectionClick("hero");
    }
  };

  const handleGetStarted = () => {
    onNavigate("upload");
  };

  return (
    <div className={isDark ? "dark" : ""}>
      <nav
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl border-b border-gray-200/30 dark:border-slate-800/30 shadow-md"
            : "bg-white/50 dark:bg-slate-950/50 backdrop-blur-md border-b border-gray-200/20 dark:border-slate-800/20"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0 hover:opacity-80 transition-opacity"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-15 transition-opacity duration-300 blur-lg scale-110"></div>
              <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 border border-blue-500/20">
                <HiDocumentCheck className="text-white text-lg font-bold" />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                ResumeOptimizer
              </h1>
              <p className="text-xs font-semibold tracking-widest text-gray-500 dark:text-gray-400 uppercase opacity-70">
                AI-Enhanced
              </p>
            </div>
          </button>

          {/* Desktop Navigation - Only show on home screen */}
          {currentScreen === "home" && (
            <ul className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => handleSectionClick(link.id)}
                    className={`relative px-4 py-2.5 font-medium text-sm transition-all duration-300 rounded-lg ${
                      activeSection === link.id
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                    }`}
                  >
                    {link.label}
                    {activeSection === link.id && (
                      <span className="absolute bottom-1.5 left-4 right-4 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-300 text-lg hover:scale-110 active:scale-95"
              aria-label="Toggle theme"
            >
              {isDark ? "☀️" : "🌙"}
            </button>

            {/* Get Started Button - Show on all screens but different action */}
            {currentScreen === "home" && (
              <button
                onClick={handleGetStarted}
                className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 border border-blue-500/20"
              >
                <span>✨</span>
                <span>Get Started</span>
              </button>
            )}

            {/* Back Button on Upload & Results screens */}
            {(currentScreen === "upload" || currentScreen === "results") && (
              <button
                onClick={() => onNavigate("home")}
                className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm text-blue-600 dark:text-blue-400 border-2 border-blue-600/30 dark:border-blue-400/30 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <span>←</span>
                <span>Back Home</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-700 dark:text-gray-300"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Only on home screen */}
      {currentScreen === "home" && (
        <div
          className={`fixed top-20 left-0 right-0 lg:hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg border-b border-gray-200/30 dark:border-slate-800/30 transition-all duration-300 ease-in-out overflow-hidden z-40 ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 py-5 space-y-2">
            {navLinks.map((link, idx) => (
              <button
                key={link.id}
                onClick={() => handleSectionClick(link.id)}
                className={`w-full text-left px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-300 transform ${
                  activeSection === link.id
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-900/50 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
                style={{
                  transitionDelay: isOpen ? `${idx * 30}ms` : "0ms",
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? "translateX(0)" : "translateX(-10px)",
                }}
              >
                {link.label}
              </button>
            ))}

            <button
              onClick={handleGetStarted}
              className="w-full mt-4 px-6 py-3 rounded-lg font-semibold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Get Started Now
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu - On Upload & Results screens */}
      {(currentScreen === "upload" || currentScreen === "results") && (
        <div
          className={`fixed top-20 left-0 right-0 lg:hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg border-b border-gray-200/30 dark:border-slate-800/30 transition-all duration-300 ease-in-out overflow-hidden z-40 ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 py-5 space-y-2">
            <button
              onClick={() => onNavigate("home")}
              className="w-full text-left px-4 py-3 rounded-lg font-semibold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
            >
              ← Back Home
            </button>
          </div>
        </div>
      )}

      <div className="h-20"></div>

      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Navbar;