import Link from "next/link";
import { Activity, ShieldCheck, Cpu, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-mono selection:bg-emerald-500/30">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-8 border-b border-white/5">
        <div className="text-xl font-bold tracking-[0.3em] uppercase italic flex items-center gap-3">
          <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-black">
            V
          </div>
          VYNO Process Guard
        </div>
        <div className="flex gap-6 text-xs uppercase tracking-widest font-bold">
          <Link
            href="/login"
            className="hover:text-emerald-500 transition-colors py-2"
          >
            Investor Login
          </Link>
          <Link
            href="/register"
            className="bg-white text-black px-6 py-2 hover:bg-emerald-500 hover:text-black transition-colors"
          >
            Deploy Sandbox
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-8 pt-32 pb-20">
        <div className="inline-block border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 rounded-full text-emerald-500 text-[10px] font-bold uppercase tracking-widest mb-8">
          EU AI Act Compliant • Industrial Grade
        </div>

        <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-8 leading-[1.1]">
          PREDICTIVE REASONING FOR <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-600">
            AUTONOMOUS MANUFACTURING.
          </span>
        </h1>

        <p className="text-neutral-400 text-lg md:text-xl max-w-2xl leading-relaxed mb-12">
          VYNO Process Guard monitors your factory telemetry in real-time,
          detecting mechanical anomalies and structural fatigue before they
          cause downtime. Powered by Llama-3.1.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/register"
            className="bg-emerald-600 hover:bg-emerald-500 text-black font-black uppercase tracking-widest px-8 py-4 flex items-center justify-center gap-3 transition-all"
          >
            Start Live Simulation <ArrowRight size={18} />
          </Link>
          <Link
            href="/login"
            className="border border-neutral-800 hover:border-neutral-600 text-white font-bold uppercase tracking-widest px-8 py-4 flex items-center justify-center transition-all"
          >
            Access Dashboard
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section className="border-t border-white/5 bg-[#0a0a0a] py-24">
        <div className="max-w-6xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <Activity className="text-emerald-500 w-8 h-8" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">
              Sub-second Telemetry
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Process massive datasets of temperature, pressure, and vibration
              metrics with zero latency.
            </p>
          </div>

          <div className="space-y-4">
            <Cpu className="text-emerald-500 w-8 h-8" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">
              Prescriptive AI
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Not just alerts. Our models provide actionable engineering
              directives to resolve root causes instantly.
            </p>
          </div>

          <div className="space-y-4">
            <ShieldCheck className="text-emerald-500 w-8 h-8" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">
              Full Isolation
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Cryptographically secured multi-tenant architecture. Your
              industrial data never leaves your isolated pipeline.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
