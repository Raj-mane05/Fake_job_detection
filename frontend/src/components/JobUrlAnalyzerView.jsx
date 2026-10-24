import React, { useState } from 'react';
import { 
  Search, 
  Link as LinkIcon, 
  Loader2, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Building2, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink, 
  BarChart3, 
  PieChart as PieIcon, 
  ArrowRight,
  Info,
  RefreshCw,
  Award,
  Layers,
  Copy,
  Check
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import { useTheme } from '../context/ThemeContext';

export default function JobUrlAnalyzerView({ onSendToDetector }) {
  const { darkMode } = useTheme();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [copied, setCopied] = useState(false);

  // Quick preset sample links for 1-click user testing
  const sampleLinks = [
    {
      label: 'Internshala Python Internship (Zero-API Native Parser)',
      url: 'https://internshala.com/internship/detail/work-from-home-part-time-python-development-internship-at-basti-ki-pathshala-foundation1791982939'
    },
    {
      label: 'WeWorkRemotely / Tech Role',
      url: 'https://weworkremotely.com/remote-jobs'
    }
  ];

  const handleScrapeAndAnalyze = async (e, directUrl = null) => {
    if (e && e.preventDefault) e.preventDefault();
    const targetUrl = directUrl || url;
    if (!targetUrl || !targetUrl.trim()) {
      setError('Please enter or paste a valid job posting web URL.');
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch('/api/scrape-and-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl.trim() })
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.detail || `Server returned error status ${response.status}`);
      }

      setData(resData);
    } catch (err) {
      setError(err.message || 'Failed to fetch and analyze job posting from the provided link.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (url) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Prepare visual data for Recharts
  const pieData = data ? [
    { 
      name: 'Authenticity', 
      value: data.analytics.authenticity_percentage, 
      color: data.ml_prediction.is_fraudulent ? '#64748b' : '#10b981' 
    },
    { 
      name: 'Fraud Risk', 
      value: data.analytics.fraud_risk_percentage, 
      color: data.ml_prediction.is_fraudulent ? '#f43f5e' : '#f59e0b' 
    }
  ] : [];

  const metricsBarData = data ? [
    { name: 'Completeness', score: data.analytics.completeness_score, fill: '#6366f1' },
    { name: 'Authenticity', score: data.analytics.authenticity_percentage, fill: '#10b981' },
    { name: 'Fraud Risk', score: data.analytics.fraud_risk_percentage, fill: data.ml_prediction.is_fraudulent ? '#f43f5e' : '#eab308' },
  ] : [];

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      
     

      {/* 🔍 Search Input & Action Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm transition-colors space-y-4">
        <form onSubmit={(e) => handleScrapeAndAnalyze(e)} className="space-y-4">
          <div className="relative flex flex-col sm:flex-row items-stretch gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <LinkIcon className="w-5 h-5" />
              </div>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste job posting link (e.g., https://internshala.com/internship/detail/...)"
                className="w-full pl-12 pr-10 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
              {url && (
                <button
                  type="button"
                  onClick={() => setUrl('')}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Clear
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all cursor-pointer shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Scraping & Analyzing...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Analyze Job</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* 1-Click Sample Previews */}
        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Quick Test Links:</span>
          {sampleLinks.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setUrl(item.url);
                handleScrapeAndAnalyze(null, item.url);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200/80 dark:border-slate-700/80 transition-all cursor-pointer font-medium"
            >
              <Sparkles className="w-3 h-3 text-indigo-500" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Scraping or Analysis Failed</p>
              <p>{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* 📊 Visual Output Section */}
      {data && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Top Status & Summary Card */}
          <div className={`p-6 sm:p-8 rounded-3xl border transition-all ${
            data.ml_prediction.is_fraudulent
              ? 'bg-gradient-to-br from-rose-50 via-white to-orange-50 dark:from-rose-950/30 dark:via-slate-900 dark:to-orange-950/20 border-rose-200 dark:border-rose-900/60 shadow-lg shadow-rose-500/5'
              : 'bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-emerald-950/30 dark:via-slate-900 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-900/60 shadow-lg shadow-emerald-500/5'
          }`}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200/80 dark:border-slate-800/80">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                    data.ml_prediction.is_fraudulent
                      ? 'bg-rose-600 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}>
                    {data.ml_prediction.is_fraudulent ? (
                      <>
                        <ShieldAlert className="w-3.5 h-3.5" /> High Scam Alert
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified Authentic Role
                      </>
                    )}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    Risk Level: {data.ml_prediction.risk_level}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    Domain: {data.domain}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {data.extracted_job.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium max-w-3xl">
                  {data.ml_prediction.summary}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 shrink-0">
                <a
                  href={data.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  Original Link
                </a>
                {onSendToDetector && (
                  <button
                    onClick={() => onSendToDetector(data.extracted_job)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
                  >
                    <span>Edit in AI Analyzer</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Stat Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
              <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                  <Building2 className="w-4 h-4 text-indigo-500" /> Organization
                </div>
                <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-1 truncate">
                  {data.extracted_job.company_profile ? data.extracted_job.company_profile.slice(0, 32) + '...' : 'Verified Org'}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                  <DollarSign className="w-4 h-4 text-emerald-500" /> Compensation / Stipend
                </div>
                <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
                  {data.extracted_job.stipend_or_salary_text || (data.extracted_job.avg_salary > 0 ? `$${data.extracted_job.avg_salary.toLocaleString()}/yr` : 'Unspecified')}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                  <MapPin className="w-4 h-4 text-purple-500" /> Work Mode
                </div>
                <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
                  {data.extracted_job.is_remote ? 'Remote / Work From Home' : (data.extracted_job.location || 'On-site')}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                  <Briefcase className="w-4 h-4 text-blue-500" /> Job Type
                </div>
                <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-1 capitalize">
                  {data.extracted_job.employment_type || 'Internship / Full-Time'}
                </div>
              </div>
            </div>
          </div>

          {/* 📊 Visual Charts & Analytics Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Donut Chart: Authenticity vs Fraud Risk (5 cols) */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PieIcon className="w-5 h-5 text-indigo-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    ML Authenticity Breakdown
                  </h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  XGBoost + TF-IDF
                </span>
              </div>

              <div className="h-56 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val, name) => [`${val}%`, name]}
                      contentStyle={{ 
                        backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                        borderColor: darkMode ? '#334155' : '#e2e8f0',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {data.analytics.authenticity_percentage}%
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    Legitimate
                  </span>
                </div>
              </div>

              {/* Legend with Metrics */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50">
                  <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">Authenticity Score</div>
                  <div className="text-lg font-black text-emerald-800 dark:text-emerald-300 mt-0.5">
                    {data.analytics.authenticity_percentage}%
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50">
                  <div className="text-[11px] font-bold text-rose-700 dark:text-rose-400">Fraud Risk Score</div>
                  <div className="text-lg font-black text-rose-800 dark:text-rose-300 mt-0.5">
                    {data.analytics.fraud_risk_percentage}%
                  </div>
                </div>
              </div>
            </div>

            {/* Bar Chart: Quality & Content Readiness Metrics (7 cols) */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Posting Health & Content Metrics
                  </h3>
                </div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Completeness: {data.analytics.completeness_score}/100
                </span>
              </div>

              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metricsBarData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={90} />
                    <Tooltip 
                      formatter={(val) => [`${val}%`, 'Score']}
                      contentStyle={{ 
                        backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                        borderColor: darkMode ? '#334155' : '#e2e8f0',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}
                    />
                    <Bar dataKey="score" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Sub Metrics Grid */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block uppercase">Word Count</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white mt-1 block">
                    {data.analytics.description_word_count + data.analytics.requirements_word_count} words
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block uppercase">Key Skills</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white mt-1 block">
                    {data.analytics.skills_count} detected
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block uppercase">Portal Trust</span>
                  <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 mt-1 block truncate">
                    {data.analytics.domain_trust}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* 📋 Scraped Job Details & Intelligence */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Job Description & Responsibilities (7 cols) */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Scraped Job Overview & Requirements
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Extracted directly from the posting URL
                </p>
              </div>

              {/* About Company */}
              {data.extracted_job.company_profile && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <Building2 className="w-4 h-4 text-indigo-500" />
                    About Organization
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {data.extracted_job.company_profile}
                  </p>
                </div>
              )}

              {/* Responsibilities */}
              {data.extracted_job.description && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Role Description & Tasks
                  </h4>
                  <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-800">
                    {data.extracted_job.description}
                  </div>
                </div>
              )}

              {/* Requirements */}
              {data.extracted_job.requirements && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Candidate Requirements & Prerequisites
                  </h4>
                  <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-800">
                    {data.extracted_job.requirements}
                  </div>
                </div>
              )}

              {/* Benefits & Perks */}
              {data.extracted_job.benefits && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Perks & Benefits
                  </h4>
                  <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/40">
                    {data.extracted_job.benefits}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Skills, Trust Signals, Red Flags & Keyword Scan (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Extracted Skills */}
              {data.extracted_job.skills_required && data.extracted_job.skills_required.length > 0 && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-indigo-500" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Identified Skills & Technologies
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {data.extracted_job.skills_required.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-3 py-1 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Authenticity Trust Signals */}
              {data.extracted_job.authenticity_highlights && data.extracted_job.authenticity_highlights.length > 0 && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Positive Authenticity Signals</span>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    {data.extracted_job.authenticity_highlights.map((highlight, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Red Flags & Risks */}
              {data.extracted_job.red_flags && data.extracted_job.red_flags.length > 0 && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Flagged Points / Considerations</span>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    {data.extracted_job.red_flags.map((flag, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{flag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suspicious Keywords Scan */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-500" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Suspicious Keywords Triggered
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-slate-500">
                    {data.ml_prediction.suspicious_count} Found
                  </span>
                </div>

                {data.ml_prediction.detected_keywords && data.ml_prediction.detected_keywords.length > 0 ? (
                  <div className="space-y-2">
                    {data.ml_prediction.detected_keywords.map((kw, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs"
                      >
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          "{kw.keyword}"
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400">
                            {kw.locations.join(', ')}
                          </span>
                          <span className="px-2 py-0.5 rounded-md font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                            ×{kw.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                    No scam keywords (e.g., wire transfer, quick money, fast cash) detected in posting text.
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
