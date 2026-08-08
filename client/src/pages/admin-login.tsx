
import { FormEvent, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";

const AdminLogin = () => {
  const [, navigate] = useLocation();
  const { isAuthenticated, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, navigate]);

  // If authenticated, we render null (or a loader) while the effect redirects
  // This prevents the login form from flashing
  if (isAuthenticated) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const success = await login(email, password);
      if (!success) {
        setError("Login failed. Check your email and password.");
        setLoading(false);
      }
      // If success, the component will re-render with isAuthenticated=true and redirect
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "An error occurred during login.");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0f172a] overflow-hidden text-slate-50">
      {/* Background dark slate gradient + soft glows */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#1e293b]/90 via-[#0f172a] to-[#020617]" />
      <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-0 w-80 h-80 rounded-full bg-sky-600/20 blur-3xl" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-6 md:px-10 lg:px-16">
        <div className="w-full max-w-6xl grid gap-10 lg:gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-center">
          {/* LEFT – premium brand panel */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="hidden md:block"
          >
            <div className="relative rounded-3xl bg-gradient-to-br from-[#1e293b] via-[#3b82f6] to-[#0ea5e9] p-[1px] shadow-[0_40px_120px_rgba(0,0,0,0.65)]">
              <div className="relative rounded-[1.45rem] bg-[#0f172a]/95 backdrop-blur-xl px-10 py-10 flex flex-col justify-between min-h-[360px] text-slate-50">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <img
                      src="/logo.png"
                      alt="RSF Logo"
                      className="h-24 w-24 rounded-2xl shadow-lg shadow-black/40"
                    />
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.24em] text-blue-200/90">
                        RSF • NGO Platform
                      </p>
                      <h1 className="text-3xl lg:text-4xl font-semibold">
                        RSF Admin
                      </h1>
                    </div>
                  </div>

                  <p className="max-w-md text-sm leading-relaxed text-slate-300/90">
                    Centralized, secure workspace for program teams and
                    leadership to manage initiatives, respond to communities,
                    and publish impact stories with confidence.
                  </p>

                  <ul className="text-sm space-y-2 text-slate-300">
                    <li>• Real-time community program oversight</li>
                    <li>• Streamlined outreach & volunteer coordination</li>
                    <li>• Editorial-grade impact storytelling tools</li>
                  </ul>
                </div>

                <div className="mt-6 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Secure internal environment
                  </span>
                  <span className="rounded-full bg-[#020617]/80 px-3 py-1 border border-blue-500/30">
                    Admin access only
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT – elevated login card */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.06 }}
            className="w-full"
          >
            <div className="mx-auto w-full max-w-md">
              <div className="relative rounded-3xl bg-white shadow-[0_30px_80px_rgba(0,0,0,0.6)] ring-1 ring-slate-200 px-8 py-9 text-slate-900">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 left-4 text-slate-400 hover:text-slate-600 hover:bg-slate-100/50"
                  onClick={() => navigate("/")}
                  title="Back to Home"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>

                {/* Header */}
                <div className="mb-6 text-center">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-blue-600">
                    RSF • Admin Console
                  </p>
                  <h2 className="text-2xl font-semibold mt-2">Admin Login</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Use your authorized administrator credentials to access the
                    RSF dashboard.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-sm">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="mt-1 text-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="password" className="text-sm">
                      Password
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pr-10 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                      {error}
                    </p>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="mt-2 w-full h-11 rounded-2xl bg-[#0f172a] hover:bg-[#1e293b] text-white text-[13px] font-medium tracking-wide flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      "Authorising…"
                    ) : (
                      <>
                        Login to dashboard
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 border-t border-dashed border-slate-200 pt-4 text-center text-[11px] text-gray-600">
                  <p className="mb-1 font-semibold text-slate-900">
                    Demo admin credentials
                  </p>
                  <p>
                    Email:{" "}
                    <span className="font-medium text-slate-900">
                      test@mail.in
                    </span>
                  </p>
                  <p>
                    Password:{" "}
                    <span className="font-medium text-slate-900">
                      1234567890
                    </span>
                  </p>
                </div>
              </div>

              <p className="mt-5 text-[10px] text-center text-slate-400">
                © {new Date().getFullYear()} RSF. Secure internal admin
                environment.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
