import React from 'react';
import { ReactTyped } from 'react-typed';
import LottiePlayer from './LottiePlayer';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Zap, 
  Search, 
  Lock, 
  FileSearch, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  AlertTriangle,
  Layers, 
  Cpu, 
  BookOpen, 
  BarChart3,
  ChevronRight,
  TrendingUp,
  Award,
  Globe2,
  Terminal,
  Activity
} from 'lucide-react';

export default function LandingPage({ onGetStarted, onExploreGuidelines, onExploreInsights }) {
  const highlights = [
    {
      icon: Cpu,
      title: "Hybrid XGBoost + TF-IDF Model",
      desc: "Evaluates 7,000 bi-gram linguistic matrices along with structural features including salary distributions and prerequisite ratios.",
      gradient: "from-blue-600 to-indigo-600",
      tag: "Dual Layer NLP"
    },
    {
      icon: ShieldAlert,
      title: "Real-Time Phishing & Scam Heuristics",
      desc: "Instantly catches advance check schemes, fake recruiter telegram links, upfront equipment deposits, and crypto laundering traps.",
      gradient: "from-indigo-600 to-purple-600",
      tag: "Heuristic Engine"
    },
    {
      icon: FileSearch,
      title: "Instant Explainable Audit Reports",
      desc: "Get an interpretable fraud risk index, authenticity score, and exact highlighted keyword triggers across job descriptions.",
      gradient: "from-purple-600 to-pink-600",
      tag: "Explainable AI"
    }
  ];

  const statCards = [
    { value: "98.85%", label: "Model Accuracy", sub: "Trained on verified global dataset" },
    { value: "< 50ms", label: "Inference Latency", sub: "Optimized FastAPI & NumPy pipeline" },
    { value: "25+", label: "Scam Vector Heuristics", sub: "Continuous keyword & syntax evaluation" },
    { value: "100%", label: "Privacy First", sub: "Zero candidate data retention" },
  ];

  const steps = [
    {
      step: "01",
      title: "Paste Job Offer Details",
      desc: "Input the job title, company overview, role description, and salary offer directly into the analyzer."
    },
    {
      step: "02",
      title: "Dual-Engine Evaluation",
      desc: "Our NLP vectorizer and XGBoost classifier analyze syntactic anomalies, domain markers, and suspicious phrasing."
    },
    {
      step: "03",
      title: "Receive Security Audit",
      desc: "View clear risk tiers (Low, Moderate, High, Critical) with highlighted fraudulent triggers before you apply."
    }
  ];

  return (
    <div className="space-y-24 pb-20 animate-fadeIn relative z-10">
      
      {/* 🚀 Hero Section: Left Dynamic Text & Right dev1.json Lottie Animation */}
      <section className="relative pt-6 sm:pt-12 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
          
          {/* Left Column: Dynamic Typography, Tag & CTA Buttons */}
          <div className="w-full lg:w-7/12 text-center lg:text-left space-y-6">
            
            {/* Top Floating Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-bold bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 shadow-md shadow-indigo-500/10">
              <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>AI-Powered Career Shield & Fraud Intelligence</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>

            {/* Dynamic Typed Main Heading */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-slate-900 dark:text-white">
                <span>Detect & Eliminate</span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">
                  <ReactTyped
                    strings={[
                      "Fake Job Scams.",
                      "Employment Phishing.",
                      "Identity Theft Traps.",
                      "Check-Cashing Frauds.",
                      "Unverified Job Offers."
                    ]}
                    typeSpeed={55}
                    backSpeed={35}
                    backDelay={2000}
                    loop
                  />
                </span>
              </h1>

              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Analyze any job posting in milliseconds using our hybrid <strong>TF-IDF NLP Vectorizer</strong> and trained <strong>XGBoost Model</strong> before sharing sensitive personal or banking info.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-extrabold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3 text-sm cursor-pointer"
              >
                <Search className="w-4 h-4" />
                Analyze Job Authenticity
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onExploreGuidelines}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl font-bold text-slate-700 dark:text-slate-200 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm transition-all flex items-center justify-center gap-2.5 text-sm cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-indigo-500" />
                Scam Guidelines
              </button>
            </div>

            {/* Quick Micro-stats */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 98.85% Accuracy
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" /> &lt;50ms Response
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-indigo-500" /> 100% Private
              </span>
            </div>

          </div>

          {/* Right Column: Lottie Animation */}
          <div className="w-full lg:w-5/12 flex items-center justify-center relative">
            {/* Ambient Multi-Color Gradient Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-indigo-500/20 to-purple-500/25 rounded-full blur-3xl pointer-events-none -z-10 transform scale-110"></div>
            
            <div className="w-full max-w-[480px] aspect-square flex items-center justify-center p-0 bg-transparent">
              <LottiePlayer />
            </div>
          </div>

        </div>

        {/* Real-time Hero Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-16">
          {statCards.map((stat, idx) => (
            <div 
              key={idx} 
              className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/75 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all text-left space-y-1 group"
            >
              <div className="text-3xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent group-hover:scale-105 transition-transform origin-left">
                {stat.value}
              </div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{stat.label}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 💎 Interactive AI Live Simulator Card */}
      <section className="max-w-5xl mx-auto p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-white/90 via-slate-50/90 to-white/90 dark:from-slate-900/90 dark:via-slate-950/90 dark:to-slate-900/90 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 font-bold">
                <Terminal className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Live NLP Fraud Diagnosis Demo
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              See how our algorithm decomposes text into semantic tokens and detects deception patterns in real time.
            </p>
          </div>
          <button
            onClick={onGetStarted}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-all self-start sm:self-auto cursor-pointer"
          >
            Open Full Scanner
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sample Scam Snapshot */}
          <div className="p-6 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                🚨 Scam Alert (94.7% Risk)
              </span>
              <ShieldAlert className="w-5 h-5 text-rose-500" />
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono bg-white/70 dark:bg-slate-900/80 p-3.5 rounded-xl border border-rose-200/60 dark:border-rose-900/40">
              "Work from home <span className="bg-rose-200 dark:bg-rose-900/80 text-rose-900 dark:text-rose-200 px-1 py-0.5 rounded font-bold">make money fast cash</span> guaranteed. No experience needed. <span className="bg-rose-200 dark:bg-rose-900/80 text-rose-900 dark:text-rose-200 px-1 py-0.5 rounded font-bold">Wire transfer</span> setup for equipment check..."
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300">#NoInterview</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300">#WireTransfer</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300">#ImmediatePayout</span>
            </div>
          </div>

          {/* Sample Legit Snapshot */}
          <div className="p-6 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                ✅ Verified Legit (99.2% Authentic)
              </span>
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono bg-white/70 dark:bg-slate-900/80 p-3.5 rounded-xl border border-emerald-200/60 dark:border-emerald-900/40">
              "Seeking Senior Full-Stack Engineer with 5+ years experience in React & Python microservices. Standard 401(k), health coverage, and collaborative team reviews..."
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">#VerifiedEmployer</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">#StandardBenefits</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">#RolePrerequisites</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="space-y-8 max-w-6xl mx-auto">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Intelligent Protection Architecture
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Engineered for Modern Employment Security
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Combines advanced natural language heuristics, TF-IDF statistical word weighting, and high-precision gradient boosted decision trees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="p-8 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all shadow-sm hover:shadow-xl space-y-4 group"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.gradient} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3-Step Verification Pipeline */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white shadow-2xl space-y-10 relative overflow-hidden border border-indigo-800/50">
        <div className="text-center space-y-2 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
            Automated ML Pipeline
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold">
            How JobGuard Verifies Listings in 3 Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {steps.map((step, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3 hover:bg-white/10 transition-all"
            >
              <div className="text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-mono">
                {step.step}
              </div>
              <h4 className="text-base font-bold text-white">{step.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center pt-4 relative z-10">
          <button
            onClick={onGetStarted}
            className="px-8 py-4 rounded-xl font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-xl transition-all inline-flex items-center gap-2 text-sm cursor-pointer"
          >
            Start Your First Scan
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
}
