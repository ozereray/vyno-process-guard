import os
import asyncio
import json
import hashlib
from collections import defaultdict
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="VYNO Process Guard API - Enterprise Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# NOT: Backend işlemleri için (RLS'i atlayıp tüm şirketleri tarayabilmek adına) 
# normalde SERVICE_ROLE_KEY kullanılır. MVP için ANON_KEY ile devam ediyoruz.
supabase: Client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

SYSTEM_PROMPT = """
You are a senior industrial AI agent monitoring process parameters.
Analyze the provided sensor data (temperature, pressure, vibration).
Output ONLY a raw JSON object with no markdown formatting. The JSON must have these exact keys:
- "anomaly_detected": boolean (true/false)
- "severity": string ("low", "medium", "critical" or null)
- "explanation": string (Plain English engineering explanation of the status)
- "recommended_action": string (Short, direct command to operators to fix the issue)
"""

async def execute_multi_tenant_analysis():
    """Tüm şirketlerin (tenant) verilerini ayrı ayrı analiz eden çekirdek motor"""
    
    # 1. Son 50 veriyi çek
    response = supabase.table("sensor_data").select("*").order("recorded_at", desc=True).limit(50).execute()
    data = response.data
    
    if not data:
        return {"status": "No data in pipeline"}

    # 2. Verileri Şirketlere (user_id) Göre Grupla
    tenant_data = defaultdict(list)
    for row in data:
        tenant_data[row.get('user_id')].append(row)

    results = []

    # 3. Her şirket için ayrı ayrı AI analizi çalıştır
    for user_id, u_data in tenant_data.items():
        if not user_id: continue # Eğer user_id yoksa atla
        
        # Sadece o şirketin son 10 verisini AI'a ver
        tenant_subset = u_data[:10]
        data_string = str(tenant_subset)
        
        try:
            completion = groq_client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": f"Analyze this recent factory sensor data: {data_string}"}
                ],
                temperature=0.2,
                response_format={"type": "json_object"} 
            )
            
            result = completion.choices[0].message.content
            parsed_result = json.loads(result)
            
            # Eğer o şirket için anomali varsa, O ŞİRKETİN hesabına (user_id) kaydet
            if parsed_result.get("anomaly_detected"):
                supabase.table("anomalies").insert({
                    "machine_id": tenant_subset[0]['machine_id'],
                    "severity": parsed_result.get("severity"),
                    "ai_explanation": parsed_result.get("explanation"),
                    "recommended_action": parsed_result.get("recommended_action"),
                    "user_id": user_id # Şirketin ID'si damgalandı!
                }).execute()
            
            results.append({"tenant": user_id, "status": "Analyzed", "anomaly": parsed_result.get("anomaly_detected")})

        except Exception as e:
            print(f"Tenant {user_id} Analysis Error: {e}")

    return {"status": "Multi-tenant scan complete", "details": results}

async def analyze_sensor_data_loop():
    while True:
        try:
            await execute_multi_tenant_analysis()
        except Exception as e:
            print(f"Error in multi-tenant loop: {e}")
        await asyncio.sleep(30) 

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(analyze_sensor_data_loop())

@app.post("/force-scan")
async def force_ai_scan():
    try:
        result = await execute_multi_tenant_analysis()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))