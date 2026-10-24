"""
Production Model Retraining Script for Job Posting Fraud Detection
Dataset: fake_job_postings.csv
Outputs:
  - tfidf_vectorizer.pkl
  - best_model.pkl
"""

import re
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from scipy.sparse import hstack
from xgboost import XGBClassifier
from sklearn.metrics import classification_report, roc_auc_score, accuracy_score

SUSPICIOUS_KEYWORDS = [
    'money', 'quick', 'no experience', 'easy', 'limited time', 'guarantee', 'click here',
    'winner', 'urgent', 'apply now', 'limited spots', 'make money', 'investment opportunity',
    'immediate start', 'work from home', 'crypto', 'bitcoin', 'wire transfer', 'cash reward',
    'get paid', 'no interview', 'sign up bonus', 'unlimited earning', '100% free', 'fast cash'
]

def clean_salary(salary):
    if pd.isna(salary):
        return 0.0
    numbers = re.findall(r'\d+', str(salary))
    if len(numbers) >= 2:
        return (float(numbers[0]) + float(numbers[1])) / 2.0
    elif len(numbers) == 1:
        return float(numbers[0])
    return 0.0

def count_suspicious_words(text):
    if not isinstance(text, str):
        return 0
    pattern = rf'\b(?:{"|".join(map(re.escape, SUSPICIOUS_KEYWORDS))})\b'
    return len(re.findall(pattern, text.lower()))

def extract_years_exp(text):
    if not isinstance(text, str):
        return 0
    matches = re.findall(r'(\d+)\s*\+?\s*(?:years?|yrs?)', text.lower())
    return int(matches[0]) if matches else 0

def train_and_export():
    print("[1/5] Loading fake_job_postings.csv dataset...")
    df = pd.read_csv("fake_job_postings.csv")
    print(f"Total rows: {len(df)}")

    print("[2/5] Engineering features matching backend schema...")
    # Fill text nulls
    for col in ['title', 'company_profile', 'description', 'requirements', 'benefits']:
        df[col] = df[col].fillna('')

    # Combined text for TF-IDF
    df['combined_text'] = (
        df['title'] + " " + 
        df['description'] + " " + 
        df['requirements'] + " " + 
        df['company_profile'] + " " + 
        df['benefits']
    ).str.strip()

    # Heuristic & tabular features
    df['avg_salary'] = df['salary_range'].apply(clean_salary)
    df['placeholder'] = 0.0  # Placeholder alignment feature
    df['telecommuting'] = df['telecommuting'].fillna(0).astype(int)
    df['suspicious_count'] = df['combined_text'].apply(count_suspicious_words)
    df['extracted_exp'] = df['combined_text'].apply(extract_years_exp)

    y = df['fraudulent'].astype(int)

    print("[3/5] Vectorizing text with TF-IDF (max_features=7000)...")
    tfidf = TfidfVectorizer(max_features=7000, stop_words='english', ngram_range=(1, 2))
    X_text = tfidf.fit_transform(df['combined_text'])

    numeric_cols = ['avg_salary', 'placeholder', 'telecommuting', 'suspicious_count', 'extracted_exp']
    X_num = df[numeric_cols].values

    X = hstack([X_text, X_num])

    print("[4/5] Training XGBoost Classifier...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # Calculate class weight ratio for imbalance
    neg_count = (y_train == 0).sum()
    pos_count = (y_train == 1).sum()
    scale_pos_weight = neg_count / max(pos_count, 1)

    model = XGBClassifier(
        n_estimators=300,
        max_depth=6,
        learning_rate=0.08,
        scale_pos_weight=scale_pos_weight,
        random_state=42,
        eval_metric="logloss"
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]

    print("\n" + "="*50)
    print("EVALUATION METRICS ON TEST SET:")
    print("="*50)
    print(f"Accuracy: {accuracy_score(y_test, y_pred) * 100:.2f}%")
    print(f"ROC-AUC:  {roc_auc_score(y_test, y_prob):.4f}")
    print("\nClassification Report:\n", classification_report(y_test, y_pred))

    print("[5/5] Exporting tfidf_vectorizer.pkl and best_model.pkl...")
    joblib.dump(tfidf, "tfidf_vectorizer.pkl")
    joblib.dump(model, "best_model.pkl")
    print("[SUCCESS] Models retrained and exported successfully!")

if __name__ == "__main__":
    train_and_export()
