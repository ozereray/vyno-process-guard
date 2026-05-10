"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Supabase Auth Kaydı
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { company_name: company }, // Şirket adını metadata olarak kaydediyoruz
      },
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Registration successful. Proceeding to Dashboard...");
      router.push("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center font-mono p-4">
      <div className="w-full max-w-md border border-neutral-800 bg-[#0a0a0a] p-8 shadow-2xl">
        <div className="mb-8">
          <Link
            href="/"
            className="text-xl font-bold tracking-[0.3em] uppercase italic mb-2 block text-emerald-500"
          >
            VYNO
          </Link>
          <h1 className="text-2xl font-black uppercase tracking-tight">
            Deploy Sandbox
          </h1>
          <p className="text-xs text-neutral-500 mt-2">
            Create an isolated tenant for your organization.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">
              Company Name
            </label>
            <input
              type="text"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="e.g. BMW Group"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">
              Work Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="engineer@company.com"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white hover:bg-emerald-500 text-black font-black uppercase tracking-widest py-4 transition-colors"
          >
            {loading ? "Provisioning Environment..." : "Initialize Environment"}
          </button>
        </form>

        <p className="text-center text-xs text-neutral-500 mt-6">
          Already have a tenant?{" "}
          <Link href="/login" className="text-white hover:text-emerald-500">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
