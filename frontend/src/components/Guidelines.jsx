import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Lock, 
  Mail, 
  CreditCard, 
  FileCheck, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Award
} from 'lucide-react';

export default function Guidelines({ onStartAnalysis }) {
  const redFlags = [
    {
      title: "Requests for Upfront Payment or 'Equipment Checks'",
      desc: "Legitimate employers never ask you to pay for background checks, equipment, software licenses, or send you an inflated check to wire back difference money.",
      badge: "High Risk Scam",
      color: "rose"
    },
    {
      title: "Instant Job Offers Without Formal Interview",
      desc: "Receiving an offer letter within minutes over Telegram, WhatsApp, SMS, or without a face-to-face/video interview is a guaranteed phishing attempt.",
      badge: "Phishing Indicator",
      color: "rose"
    },
    {
      title: "Free Email Domains for Official Hiring",
      desc: "Recruiters from reputable corporations will write from official company domains (e.g., @microsoft.com, @google.com), never from @gmail.com, @outlook.com, or randomized Yahoo addresses.",
      badge: "Domain Spoofing",
      color: "amber"
    },
    {
      title: "Vague Job Descriptions & Unrealistic Pay",
      desc: "Claims of '$1,000/day for 2 hours of copy-pasting' or 'No experience required, earn $95k immediately' are designed to prey on urgent job seekers.",
      badge: "Bait & Switch",
      color: "amber"
    },
    {
      title: "Immediate Personal & Banking Info Requests",
      desc: "Asking for SSN, bank account routing, or copies of passport/driver's license prior to a signed legitimate offer and official HR onboarding portal.",
      badge: "Identity Theft",
      color: "rose"
    }
  ];

  const safetyChecklist = [
    { title: "Verify on Official Career Page", desc: "Always check if the job ID is listed on the company's official 'Careers' website." },
    { title: "Cross-Reference Recruiter on LinkedIn", desc: "Confirm the person contacting you actually works in Talent Acquisition at that company." },
    { title: "Never Cash Check Transfers", desc: "Never deposit a check from a prospective employer to purchase equipment from their 'preferred vendor'." },
    { title: "Use Secure Job Portals", desc: "Keep all communication within reputable platforms (LinkedIn, Indeed, Handshake) until an official contract is generated." },
    { title: "Check Glassdoor & BBB Reviews", desc: "Research the company's registration, business history, and past employee feedback." }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12 animate-fadeIn">
      
      {/* Hero Banner */}
      <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/20 text-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Official Security Standard
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            How to Safeguard Your Career Search from Fraud
          </h1>
          <p className="text-indigo-200 text-sm sm:text-base leading-relaxed">
            With over $300M lost annually to employment scams, JobGuard AI provides proven strategies, actionable checklists, and red flag breakdowns to keep you safe.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={onStartAnalysis}
              className="px-6 py-3 rounded-xl bg-white text-indigo-900 font-bold text-sm shadow-lg hover:bg-indigo-50 transition-all flex items-center gap-2 cursor-pointer"
            >
              Analyze a Suspicious Job Now
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Red Flags Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              The Top 5 Scam Job Red Flags
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Common patterns identified by ML NLP models analyzing thousands of fraudulent listings.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {redFlags.map((flag, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  flag.color === 'rose'
                    ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-900'
                    : 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200 dark:border-amber-900'
                }`}>
                  {flag.badge}
                </span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-snug">
                  {flag.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {flag.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Verification Checklist */}
      <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Candidate Self-Defense Checklist
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Complete these steps before signing any offer or sharing personal info.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {safetyChecklist.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{item.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
