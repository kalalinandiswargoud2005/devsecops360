import requests
import random
import time

# CONFIGURATION
# Use your LOCAL URL for testing, then switch to Render for the final demo
API_URL = "https://devsecops-backend-g7qn.onrender.com/vulns" 

# Mock Database of common security issues (The "Signatures")
VULN_DB = [
    {"severity": "Critical", "component": "payment-gateway", "description": "SQL Injection in transaction ID"},
    {"severity": "High", "component": "auth-service", "description": "Hardcoded AWS Credentials found"},
    {"severity": "Medium", "component": "user-profile", "description": "XSS vulnerability in avatar upload"},
    {"severity": "Low", "component": "logging", "description": "Verbose error messages revealed"},
    {"severity": "Critical", "component": "docker-daemon", "description": "Privileged container escape possible"}
]

def run_scan():
    print("🕵️  Starting Security Scan...")
    time.sleep(1) # Simulate scanning time
    
    print("🔍 Analyzing Codebase...")
    time.sleep(1)
    
    # Simulate finding a random bug
    bug = random.choice(VULN_DB)
    
    print(f"⚠️  THREAT DETECTED: {bug['description']} ({bug['severity']})")
    
    # Send to the Dashboard
    try:
        response = requests.post(API_URL, json=bug)
        if response.status_code == 200:
            print("✅ Alert sent to DevSecOps Dashboard successfully!")
        else:
            print(f"❌ Failed to report bug: {response.text}")
    except Exception as e:
        print(f"❌ Connection Error: {e}")

if __name__ == "__main__":
    run_scan()