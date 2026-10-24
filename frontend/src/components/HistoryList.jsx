import React, { useState, useMemo } from 'react';
import { 
  History, 
  Trash2, 
  ArrowUpRight, 
  ShieldAlert, 
  ShieldCheck, 
  Clock, 
  Building2,
  Calendar,
  Search,
  X,
  Filter
} from 'lucide-react';

export default function HistoryList({ history, onSelectHistoryItem, onClearHistory }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState('ALL'); // 'ALL', 'FRAUD', 'SAFE'

  const filteredHistory = useMemo(() => {
    if (!history) return [];
    return history.filter((item) => {
      // Risk filter
      if (filterRisk === 'FRAUD' && !item.result?.is_fraudulent) return false;
      if (filterRisk === 'SAFE' && item.result?.is_fraudulent) return false;

      // Search keyword filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const title = (item.formData?.title || '').toLowerCase();
      const company = (item.formData?.company_profile || '').toLowerCase();
      const desc = (item.formData?.description || '').toLowerCase();
      const riskLevel = (item.result?.risk_level || '').toLowerCase();
      const date = (item.timestamp || '').toLowerCase();

      return (
        title.includes(q) ||
        company.includes(q) ||
        desc.includes(q) ||
        riskLevel.includes(q) ||
        date.includes(q)
      );
    });
  }, [history, searchQuery, filterRisk]);

  if (!history || history.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center mx-auto text-slate-400">
          <History className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">No Analysis History Yet</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
            Jobs you scan using the AI Analyzer will appear here automatically for fast reference and re-evaluation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 animate-fadeIn">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <History className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Scan & Audit History
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review past scans, risk levels, and detected anomalies ({history.length} items logged).
          </p>
        </div>
        <button
          onClick={onClearHistory}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear All
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Input Box */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by job title, company, risk level, or keyword..."
            className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setFilterRisk('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterRisk === 'ALL'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            All ({history.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterRisk('FRAUD')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              filterRisk === 'FRAUD'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Suspicious
          </button>
          <button
            type="button"
            onClick={() => setFilterRisk('SAFE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              filterRisk === 'SAFE'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Safe
          </button>
        </div>
      </div>

      {/* Filter status / results count info */}
      {(searchQuery || filterRisk !== 'ALL') && (
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
          <span>
            Showing <strong className="text-slate-900 dark:text-white">{filteredHistory.length}</strong> of {history.length} scans
            {searchQuery && <span> matching "<span className="text-indigo-600 dark:text-indigo-400 font-semibold">{searchQuery}</span>"</span>}
          </span>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterRisk('ALL');
            }}
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* History Items list or Empty Search state */}
      {filteredHistory.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">No Matching Scans Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Try adjusting your search keyword or clearing the risk filter to see other scan records.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterRisk('ALL');
            }}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectHistoryItem(item)}
              className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all shadow-xs hover:shadow-md cursor-pointer gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className={`p-2.5 rounded-xl border mt-0.5 ${
                  item.result.is_fraudulent 
                    ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-900' 
                    : 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900'
                }`}>
                  {item.result.is_fraudulent ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {item.formData.title || 'Untitled Job Position'}
                    </h3>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      item.result.is_fraudulent
                        ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-900'
                        : 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900'
                    }`}>
                      {item.result.risk_level} Risk ({(item.result.confidence_fake * 100).toFixed(0)}%)
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                    {item.formData.company_profile && (
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[150px]">{item.formData.company_profile}</span>
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.timestamp}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:underline flex items-center gap-1">
                  View Report
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
