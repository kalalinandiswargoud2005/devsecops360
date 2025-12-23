import requests
import time
from datetime import datetime

# CONFIGURATION
TARGET_URL = "https://devsecops-backend-g7qn.onrender.com" # Your Render URL
API_URL = f"{TARGET_URL}/incidents"

print(f"📡 Starting Uptime Monitor for: {TARGET_URL}")
is_down = False
start_time = None

while True:
    try:
        # Ping the server
        response = requests.get(TARGET_URL, timeout=5)
        
        # If server is UP (200 OK)
        if response.status_code == 200:
            if is_down:
                print("✅ Server is BACK ONLINE! resolving incident...")
                # Calculate how long it was down
                duration = int((datetime.now() - start_time).total_seconds() / 60)
                requests.post(API_URL, json={"status": "Resolved", "duration": duration})
                is_down = False
            else:
                print("🟢 Server is Healthy.")
        else:
            raise Exception("Status Code Error")

    except Exception as e:
        # If server is DOWN (Crash or Timeout)
        if not is_down:
            print(f"🚨 ALERT: Server CRASH DETECTED! ({e})")
            requests.post(API_URL, json={"status": "Open", "duration": 0})
            is_down = True
            start_time = datetime.now()
        else:
            print("🔴 Server is still down...")

    time.sleep(5) # Check every 5 seconds