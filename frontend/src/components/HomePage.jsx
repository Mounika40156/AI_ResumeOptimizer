import React, { useState, useEffect } from "react";
import animationVideo from "../assests/resume.mp4";
import { ArrowRight, Sparkles, Zap, BarChart3, CheckCircle, Target, Users, Clock, Shield } from "lucide-react";

const HomePage = ({ onGetStarted }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="bg-white dark:bg-slate-950">
      {/* ============================================ */}
      {/* HERO SECTION WITH VIDEO */}
      {/* ============================================ */}
      <section id="hero" className="relative overflow-hidden pt-0">
        {/* Gradient Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-950 dark:to-slate-900"></div>
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/30 dark:bg-blue-600/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200/30 dark:bg-indigo-600/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative z-20">
          <div className="flex flex-col lg:flex-row items-center justify-center h-screen px-6 sm:px-10 lg:px-16 gap-12 lg:gap-20">
            
            {/* LEFT SECTION - TEXT */}
            <div
              className={`w-full lg:w-1/2 space-y-8 transition-all duration-1000 transform flex flex-col items-center lg:items-start justify-center text-center lg:text-left lg:ml-10 ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
              }`}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/50 dark:bg-blue-950/30 rounded-full border border-blue-200/50 dark:border-blue-800/50 w-fit backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                  AI-Powered Resume Optimization
                </span>
              </div>

              {/* Main Heading */}
              <div className="space-y-6 max-w-2xl">
                <h1 className="text-5xl sm:text-6xl lg:text-6xl font-bold tracking-tight leading-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200">
                    Land Your Dream Role
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  Upload your resume and job description. Our AI analyzes your profile, identifies key strengths, and provides actionable insights to perfectly position you for the role.
                </p>
              </div>

              {/* CTA Buttons - TWO BUTTONS SIDE BY SIDE */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                {/* Primary Button */}
                <button 
                  onClick={onGetStarted}
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <span>Get Started Now</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>

                {/* Secondary Button */}
                <button className="group inline-flex items-center gap-3 px-8 py-4 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border-2 border-blue-200 dark:border-blue-800 font-semibold rounded-lg hover:bg-blue-50 dark:hover:bg-slate-700 transition-all duration-300 hover:scale-105 active:scale-95">
                  <span>📹</span>
                  <span>Watch Demo</span>
                </button>
              </div>

              {/* Trust Badge with REAL AVATARS */}
              <div className="flex flex-col items-center gap-4 pt-8">
                <div className="flex -space-x-3">
                  {[
                    { name: "Sarah", initials: "SJ", color: "from-pink-400 to-rose-500" },
                    { name: "Mike", initials: "MK", color: "from-blue-400 to-cyan-500" },
                    { name: "Emma", initials: "EC", color: "from-purple-400 to-indigo-500" }
                  ].map((user, i) => (
                    <div
                      key={i}
                      className={`w-12 h-12 rounded-full bg-gradient-to-br ${user.color} border-3 border-white dark:border-slate-950 flex items-center justify-center text-white font-bold text-sm hover:scale-125 transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg`}
                      title={user.name}
                    >
                      {user.initials}
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    500+ Resumes Optimized
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Join successful professionals
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT SECTION - VIDEO */}
            <div
              className={`w-full lg:w-1/2 flex justify-center items-center transition-all duration-1000 transform ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
              }`}
            >
              <div className="relative w-full max-w-md lg:max-w-lg">
                {/* Video container */}
                <div className="relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-100 dark:border-slate-700">
                  <div className=" bg-gray-100 dark:bg-slate-800">
                    <video
                      src={animationVideo}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Play indicator overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center group cursor-pointer">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center ">
                      <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-12 border-t-blue-600 ml-1"></div>
                    </div>
                  </div>
                </div>

                {/* Bottom accent */}
                <div className="mt-6 flex items-center justify-center gap-2">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-300 dark:via-blue-600 to-transparent"></div>
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-3">
                    Try it once
                  </span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-300 dark:via-blue-600 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* FEATURES SECTION */}
      {/* ============================================ */}
      <section id="features" className="py-24 bg-white dark:bg-slate-950 border-t border-gray-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Powerful Features
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to optimize your resume and stand out from the competition
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "AI-Powered Analysis",
                description: "Advanced AI engine analyzes your resume against job descriptions and ATS systems in seconds"
              },
              {
                icon: BarChart3,
                title: "ATS Score Optimization",
                description: "Get a detailed ATS score and see exactly how to improve your resume's compatibility"
              },
              {
                icon: Target,
                title: "Keyword Matching",
                description: "Automatically identify missing keywords and skills that matter for your target role"
              },
              {
                icon: CheckCircle,
                title: "Formatting Perfection",
                description: "Ensure your resume format is optimized for all ATS systems and human readers"
              },
              {
                icon: Users,
                title: "Industry Insights",
                description: "Get benchmarked against top candidates in your industry and field"
              },
              {
                icon: Clock,
                title: "Instant Feedback",
                description: "Receive comprehensive analysis and actionable recommendations in real-time"
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-8 rounded-xl border border-gray-200/50 dark:border-slate-800/50 hover:border-blue-200/50 dark:hover:border-blue-800/50 bg-gray-50/30 dark:bg-slate-900/30 backdrop-blur-sm hover:shadow-lg hover:scale-105 transition-all duration-300 group cursor-pointer"
              >
                <feature.icon className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* ATS SCORE SECTION */}
      {/* ============================================ */}
      <section id="ats" className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-950 border-t border-gray-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                  Understand Your ATS Score
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  Our proprietary ATS score algorithm analyzes your resume against 100+ criteria used by top ATS systems like Workday, Taleo, and iCIMS.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  "Real-time ATS compatibility scoring",
                  "Detailed breakdown by section (Header, Skills, Experience)",
                  "Benchmarking against top candidates in your field",
                  "Actionable improvement suggestions with priority levels"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium text-lg">{item}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={onGetStarted}
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Check Your ATS Score
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="relative">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 sm:p-10 shadow-2xl border border-gray-200/50 dark:border-slate-700/50">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    ATS Score Breakdown
                  </h3>
                  <div className="text-5xl font-bold text-gradient bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    87
                  </div>
                </div>

                <div className="space-y-8">
                  {[
                    { label: "Keywords & Skills", value: 95, color: "from-blue-500 to-blue-600" },
                    { label: "Format & Structure", value: 82, color: "from-indigo-500 to-indigo-600" },
                    { label: "Experience Match", value: 90, color: "from-purple-500 to-purple-600" },
                    { label: "Education & Certs", value: 75, color: "from-pink-500 to-pink-600" }
                  ].map((metric, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {metric.label}
                        </span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {metric.value}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-3 rounded-full bg-gradient-to-r ${metric.color} transition-all duration-500`}
                          style={{ width: `${metric.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/30">
                  <p className="text-sm text-blue-900 dark:text-blue-200">
                    <span className="font-semibold">💡 Pro Tip:</span> Focus on Keywords & Skills first - it has the highest impact on ATS compatibility.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* HOW IT WORKS SECTION */}
      {/* ============================================ */}
      <section id="how-it-works" className="py-24 bg-white dark:bg-slate-950 border-t border-gray-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              How It Works
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Three simple steps to optimize your resume and land more interviews
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection lines for desktop */}
            <div className="hidden md:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-300 dark:via-blue-600 to-transparent -z-10"></div>

            {[
              {
                step: "01",
                title: "Upload Your Resume",
                description: "Simply upload your resume in PDF or DOCX format. Our system securely processes it in seconds."
              },
              {
                step: "02",
                title: "AI Analysis",
                description: "Our advanced AI analyzes your resume against job requirements and ATS systems."
              },
              {
                step: "03",
                title: "Get Recommendations",
                description: "Receive detailed recommendations and download your optimized resume ready to submit."
              }
            ].map((item, idx) => (
              <div key={idx} className="relative group">
                <div className="text-6xl sm:text-7xl font-bold text-gray-200/40 dark:text-slate-800/40 absolute -top-6 -left-2 select-none">
                  {item.step}
                </div>

                <div className="relative z-10 p-8 bg-gradient-to-br from-gray-50/50 to-white dark:from-slate-900/50 dark:to-slate-950 rounded-xl border border-gray-200/50 dark:border-slate-800/50 hover:border-blue-200/50 dark:hover:border-blue-800/50 hover:shadow-lg transition-all duration-300 h-full group-hover:scale-105">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {item.description}
                  </p>

                  {idx < 2 && (
                    <div className="hidden md:block absolute -right-5 top-1/3 transform -translate-y-1/2 text-3xl text-blue-600/30 dark:text-blue-400/30 font-bold">
                      →
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <button
              onClick={onGetStarted}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Start Your Optimization Journey
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* ABOUT SECTION */}
      {/* ============================================ */}
      <section id="about" className="py-24 bg-gray-50/50 dark:bg-slate-900/50 border-t border-gray-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              About ResumeOptimizer
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We're on a mission to help job seekers worldwide pass ATS systems and land their dream roles
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Our Mission
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  We believe every qualified candidate deserves a chance. ATS systems should recognize your true potential, not reject you based on formatting. That's why we built ResumeOptimizer.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Why Choose ResumeOptimizer?
                </h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-4">
                    <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <span className="text-lg">Enterprise-grade security & privacy</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <span className="text-lg">Industry-leading AI models trained on 100K+ resumes</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <Users className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <span className="text-lg">Trusted by 500+ professionals worldwide</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600/10 to-indigo-600/10 dark:from-blue-600/5 dark:to-indigo-600/5 rounded-2xl p-10 border border-blue-200/30 dark:border-blue-800/30">
              <div className="grid grid-cols-2 gap-8">
                {[
                  { number: "500+", label: "Resumes Optimized", icon: "📄" },
                  { number: "94%", label: "Success Rate", icon: "🎯" },
                  { number: "50+", label: "ATS Systems Supported", icon: "🔧" },
                  { number: "24/7", label: "Support Available", icon: "💬" }
                ].map((stat, idx) => (
                  <div key={idx} className="text-center p-4 rounded-lg hover:bg-white/30 dark:hover:bg-slate-800/30 transition-all duration-300">
                    <div className="text-3xl mb-2">{stat.icon}</div>
                    <div className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {stat.number}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* FINAL CTA SECTION */}
      {/* ============================================ */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-950 dark:to-indigo-950 border-t border-blue-500/20">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Optimize Your Resume?
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of job seekers who've successfully passed ATS systems and landed interviews with ResumeOptimizer.
          </p>
          <button
            onClick={onGetStarted}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-lg font-semibold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-950 hover:bg-gray-100 dark:hover:bg-slate-900 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-blue-100/70 text-sm mt-6">
            No credit card required. Start optimizing in seconds.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;