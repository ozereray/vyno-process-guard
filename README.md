# 🏭 VYNO Process Guard

An enterprise-grade industrial AI monitoring platform built for real-time factory telemetry analysis, anomaly detection, and predictive operational intelligence.

VYNO Process Guard combines modern cloud infrastructure with AI-powered reasoning systems to help industrial organizations detect mechanical risks before failures occur and generate actionable engineering recommendations in real time.

---

## ✨ Features

- 🏭 Real-time industrial telemetry monitoring
- ⚡ Sub-second live data streaming
- 🤖 AI-powered anomaly detection using Llama 3.1
- 🧠 Prescriptive engineering recommendations
- 🔐 Multi-tenant enterprise architecture
- 🛡 Row Level Security (RLS) for data isolation
- 📊 Real-time operational dashboards
- 🔄 WebSocket-powered live updates
- 📜 Immutable AI audit trail logging
- 🇪🇺 EU AI Act-ready compliance infrastructure

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Charts & Visualization:** Recharts
- **Backend:** FastAPI (Python)
- **AI Engine:** Llama-3.1 via Groq API
- **Database:** PostgreSQL
- **Realtime Infrastructure:** Supabase Realtime
- **Authentication:** Supabase Auth
- **Security Layer:** PostgreSQL Row Level Security (RLS)

---

## 📦 Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/vyno-process-guard.git

cd vyno-process-guard
```

Install frontend dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
pip install -r requirements.txt
```

---

## ⚙️ Environment Setup

Create a `.env.local` file for the frontend:

```env id="frontendenv"
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Create a `.env` file for the backend:

```env id="backendenv"
GROQ_API_KEY=your_groq_api_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=your_database_url
```

---

## ▶️ Running the Platform

### Start Frontend

```bash id="frontendrun"
npm run dev
```

### Start Backend

```bash id="backendrun"
uvicorn main:app --reload
```

Frontend will run on:

```bash id="frontendurl"
http://localhost:3000
```

Backend API will run on:

```bash id="backendurl"
http://localhost:8000
```

---

## 📁 Project Structure

```bash id="projectstructure"
vyno-process-guard/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── dashboard/
│   ├── charts/
│   └── services/
│
├── backend/
│   ├── api/
│   ├── ai/
│   ├── telemetry/
│   ├── monitoring/
│   └── security/
│
├── database/
├── docs/
├── requirements.txt
└── README.md
```

---

## 🚀 Core Capabilities

### 🤖 Predictive AI Monitoring

The platform continuously analyzes telemetry streams using **Llama-3.1** to identify abnormal mechanical patterns and operational risks before failures occur.

---

### 📡 Real-Time Telemetry Infrastructure

Powered by **Supabase Realtime** and WebSockets for sub-second telemetry synchronization across industrial dashboards.

---

### 🛡 Enterprise Security Architecture

Every telemetry packet is securely associated with a unique organization and verified using PostgreSQL Row Level Security policies.

---

### 📜 Immutable AI Audit Logging

All AI-generated recommendations are hashed and stored to provide transparent decision tracking and compliance-ready auditability.

---

## 🔐 Security & Compliance

VYNO Process Guard is designed with enterprise-grade security principles:

- Row Level Security (RLS)
- Multi-tenant isolation
- Secure API communication
- Immutable audit logging
- Tenant-scoped telemetry streams
- EU AI Act-oriented traceability architecture

---

## 📊 Use Cases

- Smart Factory Monitoring
- Predictive Maintenance
- Industrial Risk Detection
- Manufacturing Intelligence
- Equipment Failure Prevention
- Real-Time Operational Analytics

---

## 🚀 Deployment

### Frontend Deployment

Recommended platform:

- Vercel

Build the frontend:

```bash id="buildfrontend"
npm run build
```

---

### Backend Deployment

Recommended platforms:

- Railway
- Render
- Docker
- Kubernetes

Run production server:

```bash id="productionserver"
uvicorn main:app --host 0.0.0.0 --port 8000
```

---

## 📚 Learn More

Useful resources related to the technologies used in this project:

- Next.js Documentation  
- FastAPI Documentation  
- Supabase Documentation  
- Groq API Documentation  
- PostgreSQL RLS Documentation  

---

## 📄 License

This project is licensed under the MIT License.

---

## 🤝 Contributing

Contributions, ideas, and improvements are welcome.

Feel free to fork the project and submit pull requests.

---

## 💡 Author

Built for modern industrial intelligence systems using AI-powered monitoring infrastructure.

**Eray Özer**
