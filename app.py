"""
FastAPI Backend for Fake Job Posting Detector
Serves ML model predictions, suspicious keywords analytics, and sample dataset items.
"""

import os
import io
import json
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
import re
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse
import joblib
import pandas as pd
import numpy as np
from scipy.sparse import hstack
from PIL import Image
import warnings

# Load environment variables
load_dotenv()

# Suppress sklearn/xgboost version warnings during inference
warnings.filterwarnings("ignore")

# Initialize Gemini Client if API key is present
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
gemini_client = None
if GEMINI_API_KEY:
    try:
        from google import genai
        gemini_client = genai.Client(api_key=GEMINI_API_KEY)
        print("[INFO] Gemini Vision client initialized successfully.")
    except Exception as e:
        print(f"[WARN] Failed to initialize Gemini client: {e}")
else:
    print("[WARN] GEMINI_API_KEY not found in environment.")

app = FastAPI(
    title="Job Posting Analyzer API",
    description="REST API for predicting real vs fraudulent job postings with text analysis and OCR.",
    version="1.1.0"
)

# Enable CORS for React frontend (Vite default dev server & production builds)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Suspicious keywords dictionary with categories
SUSPICIOUS_KEYWORDS = [
    'money', 'quick', 'no experience', 'easy', 'limited time', 'guarantee', 'click here',
    'winner', 'urgent', 'apply now', 'limited spots', 'make money', 'investment opportunity',
    'immediate start', 'work from home', 'crypto', 'bitcoin', 'wire transfer', 'cash reward',
    'get paid', 'no interview', 'sign up bonus', 'unlimited earning', '100% free', 'fast cash'
]

# Load Pretrained TF-IDF and Model
try:
    tfidf = joblib.load("tfidf_vectorizer.pkl")
    model = joblib.load("best_model.pkl")
    print("[INFO] TF-IDF vectorizer and XGBoost model loaded successfully.")
except Exception as e:
    print(f"[ERROR] Failed to load models: {e}")
    tfidf = None
    model = None

class JobAnalysisRequest(BaseModel):
    title: str = Field("", description="Job Title")
    company_profile: str = Field("", description="Company Profile / About")
    description: str = Field("", description="Job Description")
    requirements: str = Field("", description="Job Requirements")
    benefits: str = Field("", description="Benefits & Perks")
    avg_salary: float = Field(0.0, ge=0, description="Average expected salary")
    is_remote: bool = Field(False, description="Is it remote?")
    years_experience: int = Field(0, ge=0, le=50, description="Years of experience specified")

class KeywordMatch(BaseModel):
    keyword: str
    count: int
    locations: List[str]

class PredictionResponse(BaseModel):
    prediction: str  # "FAKE" or "REAL"
    is_fraudulent: bool
    confidence_fake: float
    confidence_real: float
    suspicious_count: int
    detected_keywords: List[KeywordMatch]
    extracted_experience: int
    risk_level: str  # "Low", "Moderate", "High", "Critical"
    summary: str

def analyze_keywords(fields: Dict[str, str]):
    matches = []
    total_count = 0
    for kw in SUSPICIOUS_KEYWORDS:
        pattern = rf'\b{re.escape(kw)}\b'
        kw_count = 0
        found_in = []
        for field_name, text in fields.items():
            if not text:
                continue
            c = len(re.findall(pattern, text.lower()))
            if c > 0:
                kw_count += c
                found_in.append(field_name)
        if kw_count > 0:
            total_count += kw_count
            matches.append(KeywordMatch(keyword=kw, count=kw_count, locations=found_in))
    return total_count, matches

def extract_years_experience(text: str) -> int:
    matches = re.findall(r'(\d+)\s*\+?\s*(?:years?|yrs?)', text.lower())
    return int(matches[0]) if matches else 0

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "models_loaded": (tfidf is not None and model is not None)
    }

@app.get("/api/samples")
def get_sample_jobs():
    """Return pre-crafted real and fake job templates for fast testing."""
    return [
        {
            "id": "scam-1",
            "type": "Scam/Fake Job Example",
            "title": "Urgent Data Entry Specialist - Immediate Start No Interview",
            "company_profile": "Global Financial Group offering high return investment opportunity and instant cash rewards.",
            "description": "Work from home and make money online fast cash guaranteed. Easy tasks with unlimited earning potential. Apply now to secure limited spots! Sign up bonus included after wire transfer setup.",
            "requirements": "No experience needed. Must have internet connection. 100% free registration. Get paid daily.",
            "benefits": "Weekly payout in crypto/bitcoin, flexible hours, cash reward on early completion.",
            "avg_salary": 95000,
            "is_remote": True,
            "years_experience": 0
        },
        {
            "id": "real-1",
            "type": "Legitimate Job Example",
            "title": "Senior Full-Stack Engineer (React / Python)",
            "company_profile": "CloudScale is a venture-backed SaaS platform helping enterprise engineering teams monitor distributed microservices and cloud infrastructure.",
            "description": "We are seeking an experienced Full Stack Engineer to lead front-end architecture and collaborate with backend platform teams. You will design scalable React components, establish CI/CD pipelines, and maintain RESTful APIs.",
            "requirements": "5+ years of experience with modern React, TypeScript, and Python/Node. Strong understanding of state management, responsive UI design, and cloud deployments (AWS/GCP). BS/MS in Computer Science or equivalent work experience.",
            "benefits": "Competitive salary, 401(k) matching, comprehensive health insurance (Dental/Vision), 4 weeks paid vacation, annual learning stipend.",
            "avg_salary": 145000,
            "is_remote": True,
            "years_experience": 5
        },
        {
            "id": "real-2",
            "type": "Marketing Specialist",
            "title": "Content Marketing Associate",
            "company_profile": "Aperture Digital is a creative marketing consultancy specializing in brand strategy and digital content for mid-market retail brands.",
            "description": "Looking for a driven Content Associate to produce blog articles, manage social media campaigns, and assist in client reporting.",
            "requirements": "2+ years experience in content writing or copywriting. Proficiency in WordPress and SEO tools. Excellent written communication skills.",
            "benefits": "Health benefits, hybrid work flexibility, continuous mentorship and career growth paths.",
            "avg_salary": 58000,
            "is_remote": False,
            "years_experience": 2
        }
    ]

@app.post("/api/predict", response_model=PredictionResponse)
def predict_job(payload: JobAnalysisRequest):
    if tfidf is None or model is None:
        raise HTTPException(status_code=500, detail="ML models are not loaded.")

    # Combine text fields for TF-IDF feature extraction
    fields = {
        "Job Title": payload.title,
        "Company Profile": payload.company_profile,
        "Job Description": payload.description,
        "Requirements": payload.requirements,
        "Benefits": payload.benefits
    }
    
    combined_text = f"{payload.title} {payload.description} {payload.requirements} {payload.company_profile} {payload.benefits}".strip()
    
    # Suspicious keywords analysis
    suspicious_count, detected_matches = analyze_keywords(fields)
    
    # Remote flag & experience extraction
    is_remote_flag = 1 if payload.is_remote else 0
    extracted_exp = extract_years_experience(f"{payload.requirements} {payload.description}")
    experience_to_use = payload.years_experience if payload.years_experience > 0 else extracted_exp

    # Vectorize and combine features matching training pipeline
    tfidf_vec = tfidf.transform([combined_text if combined_text else " "])
    numeric_features = pd.DataFrame([[
        payload.avg_salary,
        0,  # placeholder feature matching notebook schema
        is_remote_flag,
        suspicious_count,
        experience_to_use
    ]])
    
    final_input = hstack([tfidf_vec, numeric_features])
    
    pred = int(model.predict(final_input)[0])
    proba_fake = float(model.predict_proba(final_input)[0, 1])
    proba_real = 1.0 - proba_fake

    # Determine risk level
    if proba_fake >= 0.70:
        risk_level = "Critical"
    elif proba_fake >= 0.40:
        risk_level = "High"
    elif proba_fake >= 0.20:
        risk_level = "Moderate"
    else:
        risk_level = "Low"

    is_fake = (pred == 1) or (proba_fake >= 0.5)

    if is_fake:
        summary = f"High probability of fraud ({proba_fake * 100:.1f}% risk score). Multiple high-risk indicators or linguistic anomalies detected."
    else:
        summary = f"Posting matches authentic employment patterns ({proba_real * 100:.1f}% authenticity score)."

    return PredictionResponse(
        prediction="FAKE" if is_fake else "REAL",
        is_fraudulent=is_fake,
        confidence_fake=round(proba_fake, 4),
        confidence_real=round(proba_real, 4),
        suspicious_count=suspicious_count,
        detected_keywords=detected_matches,
        extracted_experience=experience_to_use,
        risk_level=risk_level,
        summary=summary
    )

@app.post("/api/ocr-extract")
async def ocr_extract_job(file: UploadFile = File(...)):
    """
    Extract structured job details from an uploaded screenshot using Gemini Flash Vision.
    """
    if not gemini_client:
        raise HTTPException(
            status_code=500,
            detail="Gemini Vision API is not configured. Please set GEMINI_API_KEY in the .env file."
        )

    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image file: {str(e)}")

    prompt = """You are an expert AI specialized in reading and parsing job postings from screenshots.
Analyze this job posting screenshot carefully and extract the information into a structured JSON object matching this schema:
{
  "title": "Exact job title or role name",
  "company_profile": "Company background, about section, or hiring company name",
  "description": "Full job description, primary responsibilities, and tasks",
  "requirements": "Required qualifications, skills, education, certifications, and prerequisites",
  "benefits": "Offered perks, benefits, compensation package, healthcare, vacation, etc.",
  "avg_salary": 0.0,
  "is_remote": false,
  "years_experience": 0,
  "raw_text": "Complete transcribed text from the image for reference"
}

Extraction Rules:
1. "avg_salary": If an annual salary or hourly wage is mentioned, convert it to an estimated annual USD number (e.g., "$30/hr" -> 60000, "$80k-$100k" -> 90000). If no salary is stated, return 0.0.
2. "is_remote": Set to true if Remote, Work from Home, or Telecommute is specified; false otherwise.
3. "years_experience": Extract the minimum years of experience required as an integer (e.g., "3+ years" -> 3). If none specified, return 0.
4. "raw_text": Include all readable text extracted from the screenshot.
5. Return ONLY a valid JSON object. Do not include markdown code block syntax or extra conversational text.
"""

    try:
        from google.genai import types
        response = gemini_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[image, prompt],
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )
        
        parsed_data = json.loads(response.text)
        return {
            "success": True,
            "data": parsed_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Vision extraction failed: {str(e)}")

class JobUrlAnalysisRequest(BaseModel):
    url: str = Field(..., description="Job posting web URL to scrape and analyze")

@app.post("/api/scrape-and-analyze")
def scrape_and_analyze_job(payload: JobUrlAnalysisRequest):
    """
    Fetches and scrapes job details from any job posting URL (Internshala, LinkedIn, Indeed, etc.),
    structures the data using intelligent parsing + Gemini fallback,
    and runs the full ML fraud prediction and deep visual analytics pipeline.
    """
    target_url = payload.url.strip()
    if not target_url.startswith(("http://", "https://")):
        raise HTTPException(status_code=400, detail="Invalid URL. Please enter a valid web link starting with http:// or https://")

    domain = urlparse(target_url).netloc.replace("www.", "")

    # Step 1: Web Scrape URL Content
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
            "(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
        ),
        "Accept-Language": "en-US,en;q=0.9",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"
    }

    try:
        resp = requests.get(target_url, headers=headers, timeout=15)
        if resp.status_code != 200:
            raise HTTPException(
                status_code=400,
                detail=f"Unable to fetch the webpage (HTTP status {resp.status_code}). The job board may be blocking automated requests or the posting may be expired."
            )
        html_content = resp.text
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=400, detail=f"Failed to connect to the link: {str(e)}")

    # Step 2: Extract text and metadata with BeautifulSoup
    soup = BeautifulSoup(html_content, "html.parser")

    # Extract metadata tags
    meta_title = ""
    og_title = soup.find("meta", property="og:title") or soup.find("meta", attrs={"name": "title"})
    if og_title and og_title.get("content"):
        meta_title = og_title["content"].strip()

    meta_desc = ""
    og_desc = soup.find("meta", property="og:description") or soup.find("meta", attrs={"name": "description"})
    if og_desc and og_desc.get("content"):
        meta_desc = og_desc["content"].strip()

    # Step 2: Dedicated Extraction via JSON-LD, Specialized Portals & Semantic HTML
    extracted_data = {
        "title": "",
        "company_profile": "",
        "description": "",
        "requirements": "",
        "benefits": "",
        "avg_salary": 0.0,
        "is_remote": ("remote" in target_url.lower() or "work-from-home" in target_url.lower() or "wfh" in target_url.lower()),
        "years_experience": 0,
        "location": "Flexible / Not Stated",
        "employment_type": "Internship" if "intern" in target_url.lower() else "Full-time",
        "skills_required": [],
        "source_domain": domain,
        "stipend_or_salary_text": "Not specified",
        "authenticity_highlights": [],
        "red_flags": []
    }

    # Method A: Try JSON-LD Schema.org JobPosting (Standard on LinkedIn, Indeed, Google Jobs, Greenhouse, Lever, etc.)
    found_json_ld = False
    for script_tag in soup.find_all("script", type="application/ld+json"):
        try:
            if not script_tag.string:
                continue
            raw_json = json.loads(script_tag.string.strip())
            items = raw_json if isinstance(raw_json, list) else [raw_json]
            for item in items:
                if isinstance(item, dict) and item.get("@type") in ["JobPosting", "http://schema.org/JobPosting"]:
                    extracted_data["title"] = item.get("title") or extracted_data["title"]
                    org = item.get("hiringOrganization")
                    if isinstance(org, dict):
                        extracted_data["company_profile"] = org.get("name") or extracted_data["company_profile"]
                    elif isinstance(org, str):
                        extracted_data["company_profile"] = org
                    
                    desc = item.get("description", "")
                    if desc:
                        # Clean HTML tags inside JSON-LD description
                        clean_desc = BeautifulSoup(desc, "html.parser").get_text(separator="\n", strip=True)
                        extracted_data["description"] = clean_desc[:2500]
                    
                    emp_type = item.get("employmentType")
                    if emp_type:
                        extracted_data["employment_type"] = emp_type if isinstance(emp_type, str) else ", ".join(emp_type)
                    
                    skills = item.get("skills")
                    if skills:
                        extracted_data["skills_required"] = [s.strip() for s in skills.split(",")] if isinstance(skills, str) else skills
                    
                    found_json_ld = True
                    break
            if found_json_ld:
                break
        except Exception:
            pass

    # Method B: Dedicated Deep Scraper for Internshala (100% offline, Zero API needed)
    if "internshala.com" in domain:
        # Title
        h1 = soup.find("h1") or soup.find("div", class_="heading_4_5") or soup.find("div", class_="profile")
        if h1:
            extracted_data["title"] = h1.get_text(separator=" ", strip=True)
        
        # Company
        c_tag = soup.find("div", class_="company_name") or soup.find("a", class_="link_display_like_text")
        if c_tag:
            extracted_data["company_profile"] = c_tag.get_text(separator=" ", strip=True)

        # Stipend
        stipend_tag = soup.find("span", class_="stipend") or soup.find("div", class_="stipend_container")
        if stipend_tag:
            stipend_str = stipend_tag.get_text(strip=True)
            extracted_data["stipend_or_salary_text"] = stipend_str
            # Auto parse INR stipend
            num_match = re.search(r'[\d,]+', stipend_str)
            if num_match:
                try:
                    val = float(num_match.group(0).replace(',', ''))
                    if 'month' in stipend_str.lower():
                        extracted_data["avg_salary"] = round(val * 12, 2)
                    else:
                        extracted_data["avg_salary"] = val
                except ValueError:
                    pass

        # Location & Remote status
        loc_tag = soup.find("a", class_="location_link") or soup.find("span", class_="location_link")
        if loc_tag:
            loc_text = loc_tag.get_text(strip=True)
            extracted_data["location"] = loc_text
            if "work from home" in loc_text.lower() or "remote" in loc_text.lower():
                extracted_data["is_remote"] = True

        # Skills bubbles
        skill_tags = soup.find_all("span", class_="round_tabs")
        if skill_tags:
            extracted_data["skills_required"] = [s.get_text(strip=True) for s in skill_tags if s.get_text(strip=True)]

        # Detailed Sections (Internshala specific section selectors)
        sections = soup.find_all(["div", "section"], class_=lambda c: c and any(k in str(c) for k in ["text-container", "internship_details", "detail_view", "section_heading"]))
        
        full_page_text = "\n".join([s.get_text(separator="\n", strip=True) for s in sections])
        
        # Split into About Company, Responsibilities, Who can apply, Perks
        about_m = re.search(r'About\s+[^\n]+(?:\n|:)(.*?)(?=About the|Skill\(s\)|Who can apply|Perks|$)', full_page_text, re.DOTALL | re.IGNORECASE)
        if about_m and len(about_m.group(1).strip()) > 20:
            extracted_data["company_profile"] = about_m.group(1).strip()[:1000]

        resp_m = re.search(r'About the (?:work from home |part time |job\/)?internship(?:\n|:)(.*?)(?=Skill\(s\)|Who can apply|Perks|Number of openings|$)', full_page_text, re.DOTALL | re.IGNORECASE)
        if resp_m and len(resp_m.group(1).strip()) > 20:
            extracted_data["description"] = resp_m.group(1).strip()[:1800]

        req_m = re.search(r'Who can apply(?:\n|:)(.*?)(?=Perks|Number of openings|About the|$)', full_page_text, re.DOTALL | re.IGNORECASE)
        if req_m and len(req_m.group(1).strip()) > 15:
            extracted_data["requirements"] = req_m.group(1).strip()[:1000]

        perks_m = re.search(r'Perks(?:\n|:)(.*?)(?=Number of openings|Who can apply|$)', full_page_text, re.DOTALL | re.IGNORECASE)
        if perks_m and len(perks_m.group(1).strip()) > 5:
            extracted_data["benefits"] = perks_m.group(1).strip()[:800]

        extracted_data["authenticity_highlights"].append("Verified Internshala listing portal")
        if "unpaid" in extracted_data["stipend_or_salary_text"].lower():
            extracted_data["red_flags"].append("Unpaid position - Verify certificate or college credit offer")

    # Method C: Dedicated LinkedIn / Indeed / General Career fallback
    meta_title = ""
    og_title = soup.find("meta", property="og:title") or soup.find("meta", attrs={"name": "title"})
    if og_title and og_title.get("content"):
        meta_title = og_title["content"].strip()

    meta_desc = ""
    og_desc = soup.find("meta", property="og:description") or soup.find("meta", attrs={"name": "description"})
    if og_desc and og_desc.get("content"):
        meta_desc = og_desc["content"].strip()

    if not extracted_data["title"]:
        h1 = soup.find("h1")
        extracted_data["title"] = h1.get_text(strip=True) if h1 else (meta_title or "Job Position")
    
    if not extracted_data["description"]:
        extracted_data["description"] = meta_desc or ""

    # Clean script/style tags for raw body text extraction
    for tag in soup(["script", "style", "nav", "footer", "noscript", "svg", "header"]):
        tag.decompose()

    body_text = soup.get_text(separator="\n", strip=True)
    body_text_clean = "\n".join([line.strip() for line in body_text.splitlines() if len(line.strip()) > 3])
    truncated_text = body_text_clean[:6000]

    if not extracted_data["description"]:
        extracted_data["description"] = truncated_text[:1500]

    # Heuristic detection of years experience
    if extracted_data["years_experience"] == 0:
        extracted_data["years_experience"] = extract_years_experience(f"{extracted_data['requirements']} {extracted_data['description']}")

    # Heuristic detection of skills from standard tech keywords if empty
    if not extracted_data["skills_required"]:
        common_tech = ["Python", "JavaScript", "React", "Node.js", "Java", "SQL", "HTML", "CSS", "AWS", "Git", "Docker", "Machine Learning", "Data Analysis", "Django", "FastAPI", "TypeScript", "Excel", "Marketing", "SEO"]
        found_skills = [skill for skill in common_tech if re.search(rf'\b{re.escape(skill)}\b', body_text_clean, re.IGNORECASE)]
        if found_skills:
            extracted_data["skills_required"] = found_skills[:8]

    # Ensure baseline authenticity signals
    if not extracted_data["authenticity_highlights"]:
        extracted_data["authenticity_highlights"] = [f"Source domain identified: {domain}", "Clear job requirements specified"]

    # Optional Bonus Step: If Gemini is configured and we need deep summarization for arbitrary sites
    # Notice this is wrapped in a try/except so if quota is exceeded or offline, it simply passes without failing!
    has_sufficient_data = bool(extracted_data["title"] and extracted_data["description"] and len(extracted_data["description"]) > 100)
    
    if gemini_client and (not has_sufficient_data or "internshala.com" not in domain):
        try:
            from google.genai import types
            prompt = f"""You are an AI job parser. Parse this job page from {domain} into JSON:
Webpage URL: {target_url}
Meta Title: {meta_title}
Meta Description: {meta_desc}
Text:
{truncated_text[:3500]}

JSON schema:
{{
  "title": "{extracted_data['title']}",
  "company_profile": "{extracted_data['company_profile']}",
  "description": "role duties",
  "requirements": "qualifications required",
  "benefits": "perks or benefits",
  "location": "location",
  "is_remote": true,
  "avg_salary": 0.0,
  "stipend_or_salary_text": "salary",
  "years_experience": 0,
  "employment_type": "Full-time/Internship",
  "skills_required": ["Skill1"],
  "authenticity_highlights": ["Point 1"],
  "risk_factors_or_red_flags": ["Point 1"]
}}
Output ONLY valid JSON.
"""
            ai_res = gemini_client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(response_mime_type="application/json")
            )
            parsed_ai = json.loads(ai_res.text)
            for k in ["title", "company_profile", "description", "requirements", "benefits", "location", "stipend_or_salary_text", "employment_type"]:
                if parsed_ai.get(k) and (not extracted_data[k] or len(str(parsed_ai[k])) > len(str(extracted_data[k]))):
                    extracted_data[k] = parsed_ai[k]
            if parsed_ai.get("avg_salary") and extracted_data["avg_salary"] == 0:
                extracted_data["avg_salary"] = float(parsed_ai["avg_salary"])
            if parsed_ai.get("skills_required"):
                extracted_data["skills_required"] = list(set(extracted_data["skills_required"] + parsed_ai["skills_required"]))
            if parsed_ai.get("authenticity_highlights"):
                extracted_data["authenticity_highlights"] = parsed_ai["authenticity_highlights"]
            if parsed_ai.get("risk_factors_or_red_flags"):
                extracted_data["red_flags"] = parsed_ai["risk_factors_or_red_flags"]
        except Exception as e:
            # Completely non-blocking! If quota limit hit, log and continue smoothly
            print(f"[INFO] Gemini optional enhancement skipped (Quota or Network): {e}")

    # Step 4: Run Machine Learning Fraud Prediction on the Extracted Data
    req_payload = JobAnalysisRequest(
        title=extracted_data["title"],
        company_profile=extracted_data["company_profile"],
        description=extracted_data["description"],
        requirements=extracted_data["requirements"],
        benefits=extracted_data["benefits"],
        avg_salary=extracted_data["avg_salary"],
        is_remote=extracted_data["is_remote"],
        years_experience=extracted_data["years_experience"]
    )

    ml_prediction = predict_job(req_payload)

    # Step 5: Compute Advanced Visual Analytics
    # Sentiment / Quality score metrics
    desc_len = len(extracted_data["description"].split())
    req_len = len(extracted_data["requirements"].split())
    completeness_score = min(100, int((min(desc_len, 200) / 200 * 40) + (min(req_len, 100) / 100 * 30) + (15 if extracted_data["company_profile"] else 0) + (15 if extracted_data["skills_required"] else 0)))

    analytics = {
        "completeness_score": completeness_score,
        "description_word_count": desc_len,
        "requirements_word_count": req_len,
        "skills_count": len(extracted_data["skills_required"]),
        "suspicious_keywords_found": ml_prediction.suspicious_count,
        "risk_level": ml_prediction.risk_level,
        "authenticity_percentage": round(ml_prediction.confidence_real * 100, 1),
        "fraud_risk_percentage": round(ml_prediction.confidence_fake * 100, 1),
        "domain_trust": "Verified Major Job Portal" if any(p in domain for p in ["internshala.com", "linkedin.com", "indeed.com", "naukri.com", "glassdoor.com"]) else "General Web Source",
        "market_readiness": "High" if completeness_score >= 70 and not ml_prediction.is_fraudulent else ("Moderate" if not ml_prediction.is_fraudulent else "Low")
    }

    return {
        "success": True,
        "url": target_url,
        "domain": domain,
        "extracted_job": extracted_data,
        "ml_prediction": ml_prediction,
        "analytics": analytics
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)


