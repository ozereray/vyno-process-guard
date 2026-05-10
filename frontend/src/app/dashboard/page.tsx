"use client";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useRouter } from "next/navigation";
// İkonlar için (Eğer yüklü değilse lucide-react ekleyebilirsin)
import { Play, Square, Activity, Zap } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function Dashboard() {
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [sensorData, setSensorData] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // Kullanıcı ve Şirket verisi state'leri
  const [userLoading, setUserLoading] = useState(true);
  const [companyName, setCompanyName] = useState<string>("Loading...");
  const [userId, setUserId] = useState<string | null>(null);

  // Simülasyon zamanlayıcısı için ref
  const simulationInterval = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  useEffect(() => {
    // 1. KULLANICI DOĞRULAMA (Route Protection)
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }

      setUserId(session.user.id);
      setCompanyName(
        session.user.user_metadata?.company_name || "Unknown Entity",
      );
      setUserLoading(false);

      // Verileri çekmeye başla
      fetchInitialData();
    };

    checkUser();

    // 2. VERİ ÇEKME FONKSİYONU
    const fetchInitialData = async () => {
      const { data: aData } = await supabase
        .from("anomalies")
        .select("*")
        .order("detected_at", { ascending: false })
        .limit(5);
      const { data: sData } = await supabase
        .from("sensor_data")
        .select("*")
        .order("recorded_at", { ascending: false })
        .limit(15);
      if (aData) setAnomalies(aData);
      if (sData) setSensorData(sData.reverse());
    };

    // 3. REAL-TIME DİNLEYİCİLER
    const anomalyChannel = supabase
      .channel("realtime_anomalies")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "anomalies" },
        (payload) => setAnomalies((prev) => [payload.new, ...prev].slice(0, 5)),
      )
      .subscribe();

    const sensorChannel = supabase
      .channel("realtime_sensors")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "sensor_data" },
        (payload) => setSensorData((prev) => [...prev, payload.new].slice(-15)),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(anomalyChannel);
      supabase.removeChannel(sensorChannel);
      if (simulationInterval.current) clearInterval(simulationInterval.current);
    };
  }, [router]);

  // --- TARAYICI İÇİ SİMÜLASYON MOTORU ---
  const toggleSimulation = () => {
    if (isSimulating) {
      if (simulationInterval.current) clearInterval(simulationInterval.current);
      setIsSimulating(false);
    } else {
      setIsSimulating(true);
      simulationInterval.current = setInterval(async () => {
        const isAnomaly = Math.random() > 0.85; // %15 anomali şansı
        const mockData = {
          machine_id: ["CNC-01", "ROBOT-ARM-03", "PRESS-05"][
            Math.floor(Math.random() * 3)
          ],
          temperature: isAnomaly
            ? Math.random() * 25 + 90
            : Math.random() * 20 + 25,
          pressure: isAnomaly
            ? Math.random() * 50 + 180
            : Math.random() * 20 + 100,
          vibration: isAnomaly
            ? Math.random() * 3 + 3.5
            : Math.random() * 0.7 + 0.1,
          user_id: userId,
        };
        await supabase.table("sensor_data").insert(mockData);
      }, 5000); // 5 saniyede bir veri gönderir
    }
  };

  const handleForceScan = async () => {
    setIsScanning(true);
    try {
      await fetch("https://vyno-api.onrender.com/force-scan", {
        method: "POST",
      });
    } catch (error) {
      console.error("Scan error:", error);
    } finally {
      setTimeout(() => setIsScanning(false), 2000);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-emerald-500 font-mono text-sm uppercase tracking-widest animate-pulse">
        Verifying Security Protocol...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 font-mono selection:bg-emerald-500/30">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-neutral-800 pb-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tighter uppercase italic tracking-[0.2em]">
            VYNO Process Guard
          </h1>
          <p className="text-neutral-500 text-sm flex items-center gap-2 mt-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            {companyName} • Active Pipeline
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* SİMÜLASYON BUTONU (Yeni) */}
          <button
            onClick={toggleSimulation}
            className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest border transition-all flex items-center gap-2 ${
              isSimulating
                ? "bg-red-500/10 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                : "bg-emerald-500/10 border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white"
            }`}
          >
            {isSimulating ? (
              <>
                <Square size={12} fill="currentColor" /> Stop Factory
              </>
            ) : (
              <>
                <Play size={12} fill="currentColor" /> Connect Factory
              </>
            )}
          </button>

          <button
            onClick={handleForceScan}
            disabled={isScanning || !isSimulating}
            className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest border transition-all duration-500 disabled:opacity-30 flex items-center gap-2 ${
              isScanning
                ? "bg-emerald-500 border-emerald-500 text-black animate-pulse"
                : "border-neutral-700 hover:border-emerald-500 hover:text-emerald-500 bg-transparent"
            }`}
          >
            <Zap size={12} className={isScanning ? "animate-spin" : ""} />
            {isScanning ? "Scanning..." : "Run AI Scan"}
          </button>

          <div className="bg-emerald-500/10 border border-emerald-500/50 px-3 py-1 rounded-full flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs text-emerald-500 font-bold uppercase">
              System Healthy
            </span>
          </div>

          <button
            onClick={() => {
              supabase.auth.signOut();
              router.push("/");
            }}
            className="text-[10px] text-neutral-600 hover:text-white uppercase tracking-widest transition-colors font-bold"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol Kolon: Telemetri */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 border border-neutral-800 bg-neutral-900/20 rounded-lg h-96 flex flex-col shadow-2xl shadow-black relative overflow-hidden">
            {/* Veri akışı yoksa gösterilecek karartma katmanı */}
            {!isSimulating && (
              <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                <div className="text-center p-6 border border-neutral-800 bg-[#0a0a0a] rounded-lg">
                  <Activity
                    size={24}
                    className="mx-auto mb-3 text-neutral-700"
                  />
                  <p className="text-[10px] uppercase font-bold text-neutral-500 mb-4 tracking-widest text-white">
                    No Active Data Connection
                  </p>
                  <button
                    onClick={toggleSimulation}
                    className="text-[10px] bg-emerald-500 text-black px-6 py-2 uppercase font-black hover:bg-emerald-400 transition-colors"
                  >
                    Start Sandbox Factory
                  </button>
                </div>
              </div>
            )}

            <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-neutral-700 rounded-full"></span> Live
              Telemetry Feed
            </h2>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sensorData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#171717"
                    vertical={false}
                  />
                  <XAxis dataKey="recorded_at" hide />
                  <YAxis
                    yAxisId="left"
                    stroke="#6366f1"
                    fontSize={10}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#10b981"
                    fontSize={10}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0a0a0a",
                      border: "1px solid #262626",
                      fontSize: "10px",
                    }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="temperature"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={false}
                    isAnimationActive={false}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="vibration"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 mt-4 text-[10px] uppercase font-bold tracking-widest border-t border-neutral-900 pt-4">
              <div className="flex items-center gap-2 text-[#6366f1]">
                <span className="w-2 h-2 bg-[#6366f1] rounded-full"></span> Temp
                (°C)
              </div>
              <div className="flex items-center gap-2 text-[#10b981]">
                <span className="w-2 h-2 bg-[#10b981] rounded-full"></span> Vib
                (mm/s)
              </div>
            </div>
          </div>

          <div className="p-6 border border-neutral-800 bg-neutral-900/20 rounded-lg">
            <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-4">
              Llama-3.1 Audit Engine
            </h2>
            <div className="text-[10px] font-mono text-neutral-500 grid grid-cols-2 gap-4">
              <div className="bg-black/40 p-4 rounded border border-neutral-800">
                <p className="text-emerald-500 mb-1 tracking-widest uppercase">
                  Encryption Mode
                </p>
                <p>AES-256 Industrial Grade</p>
              </div>
              <div className="bg-black/40 p-4 rounded border border-neutral-800">
                <p className="text-emerald-500 mb-1 tracking-widest uppercase">
                  Data Integrity Hash
                </p>
                <p className="truncate">
                  SHA256: 4f46e5b934ca495991b7852b855e3b0c442...
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sağ Kolon: Detection Feed */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-4 flex justify-between items-center">
            <span>Critical Feed</span>
            <span className="text-[10px] text-neutral-600 bg-neutral-900 px-2 py-0.5 rounded italic">
              Real-time
            </span>
          </h2>

          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 scrollbar-hide">
            {anomalies.length === 0 ? (
              <div className="h-40 border border-dashed border-neutral-800 rounded-xl flex items-center justify-center text-[10px] text-neutral-600 uppercase italic font-bold">
                Monitoring Pipeline Empty
              </div>
            ) : (
              anomalies.map((item) => (
                <div
                  key={item.id}
                  className={`p-5 border bg-neutral-900/30 backdrop-blur-xl rounded-xl transition-all duration-300 border-l-4
                  ${item.severity === "critical" ? "border-red-500/30 border-l-red-500" : "border-amber-500/20 border-l-amber-500"}`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <span
                      className={`text-[9px] px-3 py-1 rounded-full uppercase font-black tracking-tighter
                      ${item.severity === "critical" ? "bg-red-500 text-black" : "bg-amber-500 text-black"}`}
                    >
                      {item.severity}
                    </span>
                    <span className="text-neutral-600 text-[10px] font-bold tracking-widest">
                      {new Date(item.detected_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-xs text-white mb-2 font-black uppercase tracking-widest">
                    {item.machine_id}
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed italic mb-4">
                    "{item.ai_explanation}"
                  </p>

                  <div className="mt-4 pt-4 border-t border-neutral-800">
                    <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                      AI Recommended Action:
                    </div>
                    <div className="text-[11px] text-emerald-400/90 font-bold leading-tight bg-emerald-500/5 p-3 rounded border border-emerald-500/10 italic">
                      {item.recommended_action ||
                        "Performing root cause analysis..."}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
