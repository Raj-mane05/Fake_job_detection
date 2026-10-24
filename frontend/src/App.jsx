import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import DetectorView from './components/DetectorView';
import Guidelines from './components/Guidelines';
import HistoryList from './components/HistoryList';
import Insights from './components/Insights';
import JobUrlAnalyzerView from './components/JobUrlAnalyzerView';

export default function App() {
  const [activePage, setActivePage] = useState('landing');
  const [formData, setFormData] = useState({
    title: '',
    company_profile: '',
    description: '',
    requirements: '',
    benefits: '',
    avg_salary: '',
    is_remote: false,
    years_experience: 0,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [samples, setSamples] = useState([]);
  const [error, setError] = useState(null);

  // Persistent Audit History in localStorage
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('jg_scan_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('jg_scan_history', JSON.stringify(history));
    } catch (e) {
      console.error('Failed to persist history', e);
    }
  }, [history]);

  // Fetch preset sample jobs from backend
  useEffect(() => {
    fetch('/api/samples')
      .then(res => res.json())
      .then(data => setSamples(data))
      .catch(() => {
        // Fallback sample data if offline
        setSamples([
          {
            id: 'sample-scam',
            type: 'Scam Benchmark Example',
            title: 'Urgent Data Entry Specialist - Immediate Start No Interview',
            company_profile: 'Global Financial Group offering high return investment opportunity and instant cash rewards.',
            description: 'Work from home and make money online fast cash guaranteed. Easy tasks with unlimited earning potential. Apply now to secure limited spots! Sign up bonus included after wire transfer setup.',
            requirements: 'No experience needed. Must have internet connection. 100% free registration. Get paid daily.',
            benefits: 'Weekly payout in crypto/bitcoin, flexible hours, cash reward on early completion.',
            avg_salary: 95000,
            is_remote: true,
            years_experience: 0
          },
          {
            id: 'sample-real',
            type: 'Legitimate Tech Role',
            title: 'Senior Full-Stack Engineer (React / Python)',
            company_profile: 'CloudScale is a venture-backed SaaS platform helping enterprise engineering teams monitor distributed microservices and cloud infrastructure.',
            description: 'We are seeking an experienced Full Stack Engineer to lead front-end architecture and collaborate with backend platform teams. You will design scalable React components, establish CI/CD pipelines, and maintain RESTful APIs.',
            requirements: '5+ years of experience with modern React, TypeScript, and Python/Node. Strong understanding of state management, responsive UI design, and cloud deployments (AWS/GCP).',
            benefits: 'Competitive salary, 401(k) matching, comprehensive health insurance (Dental/Vision), 4 weeks paid vacation.',
            avg_salary: 145000,
            is_remote: true,
            years_experience: 5
          },
          {
            id: 'sample-marketing',
            type: 'Marketing Associate',
            title: 'Digital Marketing Strategist',
            company_profile: 'Aperture Media is a creative consultancy working with eCommerce retail brands.',
            description: 'Managing omnichannel ad campaigns, SEO content pipelines, and weekly performance analytics.',
            requirements: '2+ years in digital advertising, Google Analytics certified, strong written presentation skills.',
            benefits: 'Flexible hybrid schedule, professional development stipend, comprehensive dental.',
            avg_salary: 65000,
            is_remote: false,
            years_experience: 2
          }
        ]);
      });
  }, []);

  const handleLoadSample = (sample) => {
    setFormData({
      title: sample.title || '',
      company_profile: sample.company_profile || '',
      description: sample.description || '',
      requirements: sample.requirements || '',
      benefits: sample.benefits || '',
      avg_salary: sample.avg_salary || 0,
      is_remote: !!sample.is_remote,
      years_experience: sample.years_experience || 0,
    });
    setResult(null);
    setError(null);
  };

  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrFile, setOcrFile] = useState(null);

  const handleClear = () => {
    setFormData({
      title: '',
      company_profile: '',
      description: '',
      requirements: '',
      benefits: '',
      avg_salary: '',
      is_remote: false,
      years_experience: 0,
    });
    setResult(null);
    setError(null);
    setOcrFile(null);
  };

  const handleAnalyze = async (e, customData = null) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    setLoading(true);
    setError(null);
    setResult(null);

    const dataToPredict = customData || formData;

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...dataToPredict,
          avg_salary: Number(dataToPredict.avg_salary) || 0,
          years_experience: Number(dataToPredict.years_experience) || 0
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);

      // Add to local audit history
      const historyItem = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }),
        formData: { ...dataToPredict },
        result: data
      };
      setHistory(prev => [historyItem, ...prev.slice(0, 19)]); // Keep last 20 scans

    } catch (err) {
      setError(err.message || 'Failed to connect to backend server. Make sure port 8000 is open.');
    } finally {
      setLoading(false);
    }
  };

  const handleOcrUpload = async (file) => {
    if (!file) return;
    setOcrFile(file);
    setOcrLoading(true);
    setError(null);
    setResult(null);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const ocrRes = await fetch('/api/ocr-extract', {
        method: 'POST',
        body: uploadFormData
      });

      if (!ocrRes.ok) {
        const errJson = await ocrRes.json().catch(() => ({}));
        throw new Error(errJson.detail || `OCR failed with status ${ocrRes.status}`);
      }

      const { data } = await ocrRes.json();
      
      const newForm = {
        title: data.title || '',
        company_profile: data.company_profile || '',
        description: data.description || '',
        requirements: data.requirements || '',
        benefits: data.benefits || '',
        avg_salary: data.avg_salary || '',
        is_remote: !!data.is_remote,
        years_experience: data.years_experience || 0,
      };

      setFormData(newForm);

      // Trigger instant one-click prediction with the newly populated data
      await handleAnalyze(null, newForm);

    } catch (err) {
      setError(`OCR Extraction Error: ${err.message}`);
    } finally {
      setOcrLoading(false);
    }
  };

  const handleSelectHistoryItem = (item) => {
    setFormData(item.formData);
    setResult(item.result);
    setActivePage('detector');
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300 relative selection:bg-indigo-500 selection:text-white">
        
        {/* Subtle CSS Background Mesh in Blue & Purple */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-3xl"></div>
        </div>

        {/* 🌐 Top Navigation Bar */}
        <Navbar 
          activePage={activePage} 
          setActivePage={setActivePage} 
          historyCount={history.length} 
        />

        {/* 🚀 Main Dynamic Pages */}
        <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 relative z-10">
          {activePage === 'landing' && (
            <LandingPage 
              onGetStarted={() => setActivePage('url-analyzer')} 
              onExploreGuidelines={() => setActivePage('guidelines')}
              onExploreInsights={() => setActivePage('insights')}
            />
          )}

          {activePage === 'url-analyzer' && (
            <JobUrlAnalyzerView 
              onSendToDetector={(extractedJob) => {
                setFormData({
                  title: extractedJob.title || '',
                  company_profile: extractedJob.company_profile || '',
                  description: extractedJob.description || '',
                  requirements: extractedJob.requirements || '',
                  benefits: extractedJob.benefits || '',
                  avg_salary: extractedJob.avg_salary || 0,
                  is_remote: !!extractedJob.is_remote,
                  years_experience: extractedJob.years_experience || 0,
                });
                setActivePage('detector');
              }}
            />
          )}

          {activePage === 'detector' && (
            <DetectorView
              formData={formData}
              setFormData={setFormData}
              samples={samples}
              handleLoadSample={handleLoadSample}
              handleClear={handleClear}
              handleAnalyze={handleAnalyze}
              handleOcrUpload={handleOcrUpload}
              ocrLoading={ocrLoading}
              ocrFile={ocrFile}
              loading={loading}
              error={error}
              result={result}
              onViewGuidelines={() => setActivePage('guidelines')}
            />
          )}

          {activePage === 'guidelines' && (
            <Guidelines onStartAnalysis={() => setActivePage('detector')} />
          )}

          {activePage === 'history' && (
            <HistoryList 
              history={history} 
              onSelectHistoryItem={handleSelectHistoryItem}
              onClearHistory={handleClearHistory}
            />
          )}

          {activePage === 'insights' && (
            <Insights />
          )}
        </main>

        {/* 🛡️ Global Product Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl py-8 px-4 transition-colors relative z-10 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-black tracking-tight text-slate-900 dark:text-slate-200">
                JobGuard<span className="text-indigo-600 dark:text-indigo-400">Pro AI</span>
              </span>
              <span>•</span>
              <span>Enterprise Fraud & Phishing Intelligence Platform</span>
            </div>
            <div className="flex items-center gap-6 font-medium">
              <button onClick={() => setActivePage('landing')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">Home</button>
              <button onClick={() => setActivePage('detector')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">AI Analyzer</button>
              <button onClick={() => setActivePage('guidelines')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">Candidate Guide</button>
              <button onClick={() => setActivePage('insights')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">ML Specs</button>
              <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">FastAPI Docs</a>
            </div>
          </div>
        </footer>

      </div>
    </ThemeProvider>
  );
}
