# 🚀 Client Deployment & Setup Manual
## JobGuard Pro AI — Fake Job Posting & Fraud Detection System

This document provides a clean, step-by-step checklist to set up and run the entire project on any client laptop or computer (Windows, macOS, or Linux).

---

## 📋 System Prerequisites (Install Once)

Before running the project, ensure the client laptop has:

1. **Python (Version 3.9, 3.10, or 3.11)**:
   - Download from: [https://www.python.org/downloads/](https://www.python.org/downloads/)
   - ⚠️ **CRITICAL**: During Python installation on Windows, make sure to check the box: **"Add Python to PATH"**.
2. **Node.js (LTS version 18 or higher)**:
   - Download from: [https://nodejs.org/](https://nodejs.org/)
   - Run the default installer (Next ➔ Next ➔ Install).
3. **Google Chrome / Edge / Brave / Firefox** browser.

---

## ⚡ Method 1: Automatic 1-Click Setup (Recommended for Windows)

### Step 1: Transfer the Project
Copy the entire `Job_Posting_Analyzer` folder to the client's laptop (e.g., to Desktop or `C:\Users\<Name>\Projects\`).

### Step 2: Run the Setup Wizard
1. Open the project folder.
2. Double-click the file named:
   ```
   setup.bat
   ```
3. It will automatically:
   - Verify Python and Node.js.
   - Create a dedicated Python virtual environment (`.venv`).
   - Install all ML & Backend dependencies (`fastapi`, `xgboost`, `scikit-learn`, `pandas`, `joblib`, etc.).
   - Install all React Frontend dependencies (`lucide-react`, `recharts`, `lottie-web`, `react-typed`, `tailwindcss`).

### Step 3: Launch the Application
Whenever you want to run the project for the client:
1. **Start Backend**: Double-click `start_backend.bat` ➔ ML API starts at `http://localhost:8000`.
2. **Start Frontend**: Double-click `start_frontend.bat` ➔ React Web UI starts at `http://localhost:3000`.
3. Open your browser to **[http://localhost:3000](http://localhost:3000)**.

---

## 🛠️ Method 2: Manual Terminal Setup (Step-by-Step)

If the client prefers terminal commands or is using macOS / Linux:

### 1. Set Up Python Backend
Open a terminal in the root folder (`Job_Posting_Analyzer`):

```bash
# Create Python Virtual Environment
python -m venv .venv

# Activate Virtual Environment:
# On Windows (PowerShell):
.\.venv\Scripts\Activate.ps1
# On Windows (Command Prompt):
.\.venv\Scripts\activate.bat
# On macOS / Linux:
source .venv/bin/activate

# Install required Python packages
pip install --upgrade pip
pip install fastapi uvicorn pydantic scikit-learn xgboost pandas scipy joblib
```

### 2. Set Up React Frontend
In the same root folder, open a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install
```

---

## 🖥️ How to Run the App Manually

### Terminal 1 — Start Backend Server:
```bash
# Windows
.\.venv\Scripts\activate
python app.py

# macOS / Linux
source .venv/bin/activate
python app.py
```
> Backend runs at `http://localhost:8000` (Interactive API docs at `http://localhost:8000/docs`).

### Terminal 2 — Start Frontend Server:
```bash
cd frontend
npm run dev
```
> React Frontend runs at `http://localhost:3000`.

---

## 📂 Project Structure Overview

```
Job_Posting_Analyzer/
├── app.py                     # FastAPI backend serving ML predictions & heuristic analysis
├── best_model.pkl             # Trained XGBoost classifier
├── tfidf_vectorizer.pkl       # Pretrained TF-IDF vectorizer matrix
├── fake_job_postings.csv      # Complete dataset with 17,880 listings
├── dev1.json                  # Interactive Lottie vector animation
├── setup.bat                  # 1-Click setup wizard for client
├── start_backend.bat          # 1-Click launcher for Backend
├── start_frontend.bat         # 1-Click launcher for React Frontend
├── CLIENT_SETUP_GUIDE.md      # Client setup instructions
├── README.md                  # Complete technical documentation
└── frontend/                  # Modern React + Tailwind CSS web platform
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx         # Navigation bar with theme toggle
    │   │   ├── LandingPage.jsx    # Hero section with typed text & animation
    │   │   ├── DetectorView.jsx   # Live ML form & probability donut chart
    │   │   ├── Guidelines.jsx     # Scam-free career guidelines
    │   │   ├── HistoryList.jsx    # Persistent scan audit log
    │   │   ├── Insights.jsx       # Benchmark charts & threat distribution
    │   │   └── LottiePlayer.jsx   # Transparent vector animation component
    │   ├── context/
    │   │   └── ThemeContext.jsx   # Dark / Light mode provider
    │   ├── assets/
    │   │   └── dev1.json          # Animation asset
    │   ├── App.jsx                # Main Application routing
    │   └── index.css              # Custom styling & glassmorphism
    ├── vite.config.js             # Vite config with API proxy
    └── package.json
```

---

## 💡 Client Presentation Checklist

When demonstrating this project to your client:
1. **Hero Landing Page**: Showcase the dynamic typing title and floating transparent animation.
2. **Theme Switcher**: Click the **Sun/Moon icon** to show the custom White/Blue/Purple light & dark designs.
3. **1-Click AI Test**: Navigate to **AI Analyzer** and click **"Scam Benchmark Example"** ➔ Click **"Run AI Fraud Verification"** to show real-time risk gauges, detected keyword chips (`"wire transfer"`, `"crypto"`), and donut score meters.
4. **Interactive Charts**: Navigate to **ML Insights** to demonstrate model comparison bar charts (XGBoost 98.85%) and scam distribution percentages.
5. **Scan History**: Demonstrate that previous audits are stored in the client's browser.
6. **API Documentation**: Open `http://localhost:8000/docs` to show the interactive Swagger REST API.
