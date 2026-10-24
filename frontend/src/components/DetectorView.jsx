import React, { useRef, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { 
  Sparkles, 
  FileText, 
  Building2, 
  DollarSign, 
  Clock, 
  Globe2, 
  Search, 
  RefreshCw, 
  ChevronRight, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  FileSearch, 
  ExternalLink, 
  Info,
  BarChart2,
  Upload,
  Image as ImageIcon,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function DetectorView({
  formData,
  setFormData,
  samples,
  handleLoadSample,
  handleClear,
  handleAnalyze,
  handleOcrUpload,
  ocrLoading,
  ocrFile,
  loading,
  error,
  result,
  onViewGuidelines
}) {
  const { darkMode } = useTheme();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Dynamic Chart Data for Live Result
  const pieData = result ? [
    { name: 'Fraud Risk', value: Math.round(result.confidence_fake * 100), color: result.is_fraudulent ? '#f43f5e' : '#f59e0b' },
    { name: 'Authenticity', value: Math.round(result.confidence_real * 100), color: result.is_fraudulent ? '#64748b' : '#10b981' }
  ] : [];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Quick Benchmark Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            1-Click Benchmark Datasets
          </div>
          <button 
            type="button" 
            onClick={handleClear}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors self-start sm:self-auto cursor-pointer"
          >
            Reset Form
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {samples.map((sample, idx) => (
            <button
              key={sample.id || idx}
              type="button"
              onClick={() => handleLoadSample(sample)}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50/70 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-all text-left group cursor-pointer"
            >
              <div className="truncate pr-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block truncate">
                  {sample.type || 'Benchmark Job'}
                </span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block truncate mt-0.5">
                  {sample.title}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 shrink-0 transition-transform group-hover:translate-x-1" />
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Form & OCR (7 cols) + AI Result with Visual Graphs (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form & Screenshot OCR */}
        <div className="lg:col-span-7 space-y-6">

          {/* 📸 Screenshot OCR Upload Zone */}
          <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-2 border-dashed border-indigo-300 dark:border-indigo-700/60 rounded-3xl p-6 transition-all hover:border-indigo-500 dark:hover:border-indigo-400 group relative overflow-hidden">
            <input
              type="file"
              id="ocr-file-upload"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleOcrUpload(e.target.files[0]);
                }
              }}
            />
            
            <label
              htmlFor="ocr-file-upload"
              className="cursor-pointer flex flex-col items-center justify-center text-center space-y-3"
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                {ocrLoading ? (
                  <Loader2 className="w-7 h-7 animate-spin" />
                ) : (
                  <Upload className="w-7 h-7" />
                )}
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-center gap-1.5">
                  <span>{ocrLoading ? "Scanning Screenshot with Gemini Vision AI..." : "Upload Job Posting Screenshot"}</span>
                  <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Instant Auto-Fill
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md">
                  {ocrLoading 
                    ? "Extracting title, requirements, salary, and running ML fraud prediction..."
                    : "Drop your screenshot here (PNG, JPG, WebP) or click to browse. We'll automatically extract all fields and run instant analysis."
                  }
                </p>
              </div>

              {ocrFile && !ocrLoading && (
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 px-3 py-1.5 rounded-xl">
                  <CheckCircle className="w-4 h-4" />
                  <span>Scanned: {ocrFile.name}</span>
                </div>
              )}
            </label>
          </div>

          <form 
            onSubmit={handleAnalyze} 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm transition-colors space-y-5"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  Job Specification Form
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Verify or edit extracted details below, then click Analyze
                </p>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Job Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Remote Data Specialist, Lead React Engineer..."
                className="w-full bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all"
              />
            </div>

            {/* Company Profile */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                Company Overview / About Us
              </label>
              <textarea
                name="company_profile"
                rows="2"
                value={formData.company_profile}
                onChange={handleChange}
                placeholder="Company background, mission statement, or industry presence..."
                className="w-full bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all resize-none"
              />
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Full Job Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="description"
                rows="4"
                required
                value={formData.description}
                onChange={handleChange}
                placeholder="Core responsibilities, scope of work, day-to-day duties..."
                className="w-full bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all resize-none"
              />
            </div>

            {/* Requirements & Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Job Requirements
                </label>
                <textarea
                  name="requirements"
                  rows="3"
                  value={formData.requirements}
                  onChange={handleChange}
                  placeholder="Qualifications, technical skills, degrees..."
                  className="w-full bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Compensation & Benefits
                </label>
                <textarea
                  name="benefits"
                  rows="3"
                  value={formData.benefits}
                  onChange={handleChange}
                  placeholder="Insurance, PTO, bonuses, retirement plans..."
                  className="w-full bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all resize-none"
                />
              </div>
            </div>

            {/* Numeric & Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                  Salary ($ / yr)
                </label>
                <input
                  type="number"
                  name="avg_salary"
                  min="0"
                  value={formData.avg_salary}
                  onChange={handleChange}
                  placeholder="e.g. 85000"
                  className="w-full bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Experience (Yrs)
                </label>
                <input
                  type="number"
                  name="years_experience"
                  min="0"
                  max="30"
                  value={formData.years_experience}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex flex-col justify-end">
                <label className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-indigo-400 transition-all">
                  <input
                    type="checkbox"
                    name="is_remote"
                    checked={formData.is_remote}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                  />
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <Globe2 className="w-3.5 h-3.5 text-indigo-500" />
                    Remote Job
                  </div>
                </label>
              </div>
            </div>

            {/* Analyze Action */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-2xl font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Executing XGBoost & TF-IDF Extraction...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Run AI Fraud Verification
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: AI Output with Visual Pie/Confidence Chart */}
        <div className="lg:col-span-5 space-y-6">
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/50 dark:border-rose-900 dark:text-rose-300 text-xs flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
              <div>
                <p className="font-bold">Connection Warning</p>
                <p className="mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {!result && !loading && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center flex flex-col items-center justify-center min-h-[440px] space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-slate-700">
                <FileSearch className="w-8 h-8" />
              </div>
              <div className="max-w-xs space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Awaiting Job Submission</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select a template above or fill in the form to test against our machine learning fraud engine.
                </p>
              </div>
              <button
                type="button"
                onClick={onViewGuidelines}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 cursor-pointer pt-2"
              >
                Learn what causes fraudulent flags
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {loading && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center flex flex-col items-center justify-center min-h-[440px] space-y-4 shadow-xs animate-pulse">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                <RefreshCw className="w-8 h-8 animate-spin" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Analyzing Linguistic & Heuristic Signals</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Evaluating 7,000 TF-IDF features and salary-to-role ratios...</p>
              </div>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Main Status Verdict */}
              <div className={`p-6 sm:p-7 rounded-3xl border shadow-xl relative overflow-hidden transition-all ${
                result.is_fraudulent 
                  ? 'bg-gradient-to-b from-rose-500/10 via-white to-white border-rose-300 dark:from-rose-950/60 dark:via-slate-900 dark:to-slate-900 dark:border-rose-500/40' 
                  : 'bg-gradient-to-b from-emerald-500/10 via-white to-white border-emerald-300 dark:from-emerald-950/60 dark:via-slate-900 dark:to-slate-900 dark:border-emerald-500/40'
              }`}>
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex items-center gap-3.5">
                    <div className={`p-3 rounded-2xl border ${
                      result.is_fraudulent 
                        ? 'bg-rose-500/15 border-rose-500/30 text-rose-600 dark:text-rose-400' 
                        : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {result.is_fraudulent ? <ShieldAlert className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
                    </div>
                    <div>
                      <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
                        result.is_fraudulent
                          ? 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-900'
                          : 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-900'
                      }`}>
                        Risk Tier: {result.risk_level}
                      </span>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                        {result.is_fraudulent ? 'Fraudulent / High Scam Risk' : 'Legitimate Job Listing'}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Donut Probability Visualizer */}
                <div className="mt-5 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="w-24 h-24 relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          innerRadius={28}
                          outerRadius={42}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-slate-900 dark:text-white">
                      {result.is_fraudulent ? `${Math.round(result.confidence_fake * 100)}%` : `${Math.round(result.confidence_real * 100)}%`}
                    </div>
                  </div>

                  <div className="space-y-1.5 flex-1 pl-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Scam Probability</span>
                      <span className="font-extrabold text-rose-500">{(result.confidence_fake * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Authenticity Score</span>
                      <span className="font-extrabold text-emerald-500">{(result.confidence_real * 100).toFixed(1)}%</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium pt-0.5">
                      Evaluated via XGBoost matrix
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-4 leading-relaxed relative z-10">
                  {result.summary}
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs">
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Flagged Triggers</div>
                  <div className={`text-2xl font-extrabold mt-1 ${result.suspicious_count > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-slate-100'}`}>
                    {result.suspicious_count}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">High-frequency scam terms</div>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs">
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Authenticity Rating</div>
                  <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
                    {(result.confidence_real * 100).toFixed(1)}%
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Model confidence metric</div>
                </div>
              </div>

              {/* Detected Trigger Words */}
              {result.detected_keywords && result.detected_keywords.length > 0 && (
                <div className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 p-5 rounded-3xl shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="w-4 h-4" />
                    Flagged Phrases Detected ({result.detected_keywords.length})
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {result.detected_keywords.map((item, idx) => (
                      <span 
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                      >
                        <span>"{item.keyword}"</span>
                        <span className="bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 text-[10px] px-1.5 py-0.2 rounded-md font-bold">
                          {item.count}x
                        </span>
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic pt-1">
                    Fraudulent job postings frequently employ urgency patterns and cash incentives to manipulate candidates into skipping typical security checks.
                  </p>
                </div>
              )}

            </div>
          )}
        </div>

      </div>

    </div>
  );
}
