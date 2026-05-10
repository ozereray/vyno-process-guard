import os
import time
import random
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()
supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

machines = ["CNC-01", "ROBOT-ARM-03", "PRESS-05", "VALVE-X9"]

def login_and_push_data():
    print("=== VYNO PROCESS GUARD : FACTORY NODE SIMULATOR ===")
    email = input("Enter Tenant Email: ")
    password = input("Enter Password: ")
    
    try:
        # Authentication
        auth_response = supabase.auth.sign_in_with_password({"email": email, "password": password})
        user_id = auth_response.user.id
        print(f"✅ Connection Successful. Node Activated. (User ID: {user_id})")
    except Exception as e:
        print(f"❌ Authentication Failed. Error details: {e}")
        return

    print("📡 Transmitting sensor telemetry via encrypted pipeline...\n")
    
    while True:
        is_anomaly = random.random() > 0.85 # 15% Anomaly probability
        
        data = {
            "machine_id": random.choice(machines),
            "temperature": random.uniform(20, 45) if not is_anomaly else random.uniform(90, 115),
            "pressure": random.uniform(100, 120) if not is_anomaly else random.uniform(180, 220),
            "vibration": random.uniform(0.1, 0.8) if not is_anomaly else random.uniform(3.5, 6.0),
            "user_id": user_id 
        }
        
        print(f"[{time.strftime('%X')}] ⬆️ Transmitting: {data['machine_id']} | T: {data['temperature']:.1f}°C")
        supabase.table("sensor_data").insert(data).execute()
        time.sleep(8) 

if __name__ == "__main__":
    login_and_push_data()