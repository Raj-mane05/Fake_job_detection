# 🛡️ JobGuard Pro AI — Fake Job Posting & Fraud Detection Platform

An enterprise-grade, machine-learning-powered web platform designed to detect fraudulent job postings, identity theft traps, and employment phishing schemes. 

Built with **FastAPI REST Backend**, **XGBoost Classifier + TF-IDF NLP Pipeline**, and a modern **React + Tailwind CSS** frontend with interactive **Recharts visualizations** and **Dark & Light mode**.

---

## 🌟 Key Capabilities

- **Landing Page**: Dual-column hero section with dynamic **ReactTyped** animated phrases and a transparent **Lottie Vector Animation** (`dev1.json`).
- **AI Fraud Analyzer**: Structured form with 1-click test datasets, probability donut meters, and flagged keyword breakdown chips.
- **Visual Charts & Analytics (Recharts)**: Benchmark model comparison bar charts (XGBoost 98.85% vs. Random Forest vs. Logistic Regression), threat category donut graphs, and feature importance weighting.
- **Candidate Defense Guidelines**: 5 core red flags and a pre-contract verification checklist.
- **Persistent Scan Audit Log**: Automatic `localStorage` retention of past scan reports with 1-click re-inspection.
- **Dark & Light Mode**: Tailored White/Blue/Purple aesthetic with smooth transitions.

---

## 🚀 Quick Setup on Any Computer

### Prerequisites
1. **Python 3.9+** (Ensure *"Add Python to PATH"* is checked during install).
2. **Node.js (v18+)**.

### 1-Click Automated Setup (Windows)
1. Double-click `setup.bat` to automatically build the virtual environment and install all backend and frontend packages.
2. Launch the application:
   - Double-click `start_backend.bat` (Starts FastAPI ML API on port 8000).
   - Double-click `start_frontend.bat` (Starts React Frontend on port 3000).
3. Open **[http://localhost:3000](http://localhost:3000)** in your browser.

> For a complete setup guide and client presentation checklist, see [`CLIENT_SETUP_GUIDE.md`](CLIENT_SETUP_GUIDE.md).

---

## 💻 Manual Setup

### 1. Backend (FastAPI & ML Engine)
```bash
python -m venv .venv
.\.venv\Scripts\activate       # On macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
pip install fastapi uvicorn pydantic scikit-learn xgboost pandas scipy joblib
python app.py
```
> API available at `http://localhost:8000` (Interactive API docs at `http://localhost:8000/docs`).

### 2. Frontend (React + Tailwind CSS)
```bash
cd frontend
npm install
npm run dev
```
> Web application available at `http://localhost:3000`.

---

## 📁 Repository Structure

```
Job_Posting_Analyzer/
├── app.py                     # FastAPI REST server
├── best_model.pkl             # Trained XGBoost model
├── tfidf_vectorizer.pkl       # Pretrained TF-IDF vectorizer
├── fake_job_postings.csv      # Training & evaluation dataset
├── dev1.json                  # Vector animation file
├── setup.bat                  # Automated 1-click setup wizard
├── start_backend.bat          # 1-click backend launcher
├── start_frontend.bat         # 1-click frontend launcher
├── CLIENT_SETUP_GUIDE.md      # Client setup instructions
├── README.md                  # Main repository README
└── frontend/                  # React + Tailwind CSS client application
```
