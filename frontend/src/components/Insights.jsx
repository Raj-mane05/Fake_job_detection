import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, AreaChart, Area, Legend
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart as PieIcon, 
  ShieldAlert, 
  CheckCircle, 
  Database, 
  Cpu, 
  Zap, 
  Layers, 
  Scale, 
  Radar as RadarIcon 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Insights() {
  const { darkMode } = useTheme();

  // Color Constants for Blue, Purple & White Theme
  const primaryBlue = '#3b82f6';
  const primaryPurple = '#8b5cf6';
  const accentRose = '#f43f5e';
  const accentEmerald = '#10b981';
  const accentAmber = '#f59e0b';
  const accentIndigo = '#6366f1';

  // Benchmark Model Comparison Data
  const modelComparisonData = [
    { name: 'XGBoost (Best)', accuracy: 98.85, f1: 98.4, recall: 97.9, precision: 98.9 },
    { name: 'Random Forest', accuracy: 96.20, f1: 95.1, recall: 94.2, precision: 96.0 },
    { name: 'Logistic Reg.', accuracy: 91.40, f1: 89.8, recall: 88.5, precision: 91.2 },
    { name: 'Decision Tree', accuracy: 89.10, f1: 87.2, recall: 86.0, precision: 88.4 },
  ];

  // Scam Archetype Distribution
  const scamCategoryData = [
    { name: 'Fake Data Entry / Admin', value: 38, color: '#6366f1' },
    { name: 'Crypto & Financial Arbitrage', value: 24, color: '#8b5cf6' },
    { name: 'Package Reshipping Schemes', value: 19, color: '#ec4899' },
    { name: 'Phishing via Fake HR Portals', value: 12, color: '#3b82f6' },
    { name: 'Equipment Advance Checks', value: 7, color: '#f59e0b' },
  ];

  // Feature Importance Weight
  const featureWeightData = [
    { feature: 'TF-IDF Text n-Grams', weight: 42 },
    { feature: 'Suspicious Keywords Count', weight: 26 },
    { feature: 'Salary vs Role Ratio', weight: 16 },
    { feature: 'Remote Indicator Flag', weight: 9 },
    { feature: 'Experience Required (Yrs)', weight: 7 },
  ];

  const modelMetrics = [
    { label: "Optimal Architecture", value: "XGBoost + SMOTE", icon: Cpu, sub: "Trained on 17,880 listings" },
    { label: "NLP Dimension", value: "7,000 TF-IDF Features", icon: Database, sub: "Bi-gram semantic matrix" },
    { label: "Validation Accuracy", value: "98.85%", icon: CheckCircle, sub: "5-fold Cross Validated" },
    { label: "Inference Latency", value: "< 45ms", icon: Zap, sub: "FastAPI REST API" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12 animate-fadeIn">
      
      {/* Page Header */}
      <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Model Performance & Threat Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Interactive visual analytics covering benchmark accuracy, scam distributions, and feature importance weighting.
            </p>
          </div>
        </div>
      </div>

      {/* Model Spec Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {modelMetrics.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div 
              key={idx} 
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{item.label}</span>
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{item.value}</div>
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{item.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Visual Charts Grid (Row 1: Model Benchmark Bar Chart + Scam Distribution Donut Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Model Benchmark Performance Bar Chart (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Scale className="w-4 h-4 text-indigo-500" />
                Comparative Model Benchmarks (%)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Evaluation across Accuracy, F1-Score, and Precision metrics.
              </p>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 self-start sm:self-auto">
              XGBoost Outperformed
            </span>
          </div>

          <div className="h-[280px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelComparisonData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <XAxis 
                  dataKey="name" 
                  stroke={darkMode ? '#94a3b8' : '#64748b'} 
                  fontSize={11} 
                  tickLine={false} 
                />
                <YAxis 
                  domain={[80, 100]} 
                  stroke={darkMode ? '#94a3b8' : '#64748b'} 
                  fontSize={11} 
                  tickLine={false} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: darkMode ? '#0f172a' : '#ffffff', 
                    borderColor: darkMode ? '#334155' : '#e2e8f0',
                    borderRadius: '16px',
                    fontSize: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)'
                  }}
                  itemStyle={{ color: darkMode ? '#f8fafc' : '#0f172a' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="accuracy" name="Accuracy (%)" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="f1" name="F1-Score (%)" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="precision" name="Precision (%)" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Scam Category Distribution Donut Chart (5 cols) */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-purple-500" />
              Scam Archetype Distribution
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Breakdown of fraudulent job listings in verified global dataset.
            </p>
          </div>

          <div className="h-[210px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={scamCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {scamCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Prevalence']}
                  contentStyle={{ 
                    backgroundColor: darkMode ? '#0f172a' : '#ffffff', 
                    borderColor: darkMode ? '#334155' : '#e2e8f0',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-900 dark:text-white">100%</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase">Corpus</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            {scamCategoryData.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300 truncate">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                  <span className="truncate">{item.name}</span>
                </span>
                <span className="font-bold text-slate-900 dark:text-white shrink-0 ml-2">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Visual Charts Grid (Row 2: Feature Importance Weight Distribution) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-500" />
              Machine Learning Feature Importance Weights
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Gini impurity importance contributed by linguistic text matrices vs. structured job parameters.
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hidden sm:block">
            Dual Heuristic Weighting
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-2">
          {featureWeightData.map((item, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2"
            >
              <div className="flex justify-between items-center text-xs">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">{item.feature}</span>
              </div>
              <div className="text-xl font-black bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                {item.weight}%
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-full rounded-full" 
                  style={{ width: `${item.weight * 2}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
