# Complete Setup, Retraining & Execution Guide

This document provides step-by-step instructions to set up the project on any new laptop/machine, retrain the machine learning model, and run both frontend and backend without errors.

---

## 1. Prerequisites (For Any Laptop)

Make sure the following are installed:
1. **Python 3.10 or 3.11** ([python.org](https://www.python.org/downloads/))  
   *(Crucial: During installation, check the box **"Add python.exe to PATH"**)*
2. **Node.js (LTS version 18 or 20+)** ([nodejs.org](https://nodejs.org/))

---

## 2. One-Time Setup on a New Laptop

### Method A: Automatic Setup (Recommended)
Simply double-click:
```bat
setup.bat
```
This script will automatically:
- Verify Python and Node.js are in your PATH.
- Create a clean virtual environment (`.venv`).
- Install all required ML, backend, and Gemini OCR libraries from `requirements.txt`.
- Install all React dependencies in `frontend/`.

---

### Method B: Manual Step-by-Step Setup
If you prefer running commands manually in PowerShell or Command Prompt:

#### 1. Setup Backend & Virtual Environment:
```powershell
# Open terminal in project root
python -m venv .venv
.venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r requirements.txt
```

#### 2. Setup Gemini OCR API Key:
Create a file named `.env` in the root folder with:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

#### 3. Setup Frontend:
```powershell
cd frontend
npm install
cd ..
```

---

## 3. How to Retrain the ML Model

If you have new data or need to regenerate `tfidf_vectorizer.pkl` and `best_model.pkl` natively with your current Scikit-Learn/XGBoost version:

1. Open a terminal in the project root.
2. Activate your virtual environment and run the retraining script:
```powershell
.venv\Scripts\activate
python retrain_model.py
```

### What this does:
- Ingests `fake_job_postings.csv`.
- Extracts linguistic features + suspicious heuristic patterns + salary/experience tabular features.
- Fits a 7,000-feature `TfidfVectorizer` (unigrams + bigrams).
- Trains an `XGBClassifier` with class-imbalance weighting (`scale_pos_weight`).
- Evaluates accuracy and ROC-AUC scores.
- Exports matched `tfidf_vectorizer.pkl` and `best_model.pkl` ready for immediate production inference in FastAPI.

---

## 4. Running the Application

### Option A: Using the Launcher Scripts (Easiest)
1. Double-click `start_backend.bat`  
   *(Starts FastAPI at `http://localhost:8000`)*
2. Double-click `start_frontend.bat`  
   *(Starts React Vite at `http://localhost:3000`)*

---

### Option B: Running from Terminal

#### Terminal 1 (Backend):
```powershell
.venv\Scripts\activate
python app.py
```
- API Docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/api/health`

#### Terminal 2 (Frontend):
```powershell
cd frontend
npm run dev
```
- Application Web UI: `http://localhost:3000`

---

## 5. How to Use the Screenshot OCR Feature

1. Open the web UI at `http://localhost:3000`.
2. Navigate to **AI Analyzer**.
3. In the upload zone (**"Upload Job Posting Screenshot"**):
   - Drag & drop or select any job posting screenshot (e.g., `Job_Posting_Fake.jpg` or `Job_Posting_Real.jpg`).
4. Gemini Flash Vision automatically parses the image, extracts all fields (Title, Company, Description, Requirements, Benefits, Salary, Experience, Remote status), populates the form, and triggers instant fraud prediction.
