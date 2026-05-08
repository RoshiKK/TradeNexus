import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { User, Mail, Lock, Loader2, CheckCircle2, ArrowRight, ShieldPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/api/users/register", form);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 blur-[120px] rounded-full -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-card relative overflow-hidden border-white/10">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500" />

          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <div className="flex justify-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                    <ShieldPlus className="w-8 h-8 text-emerald-500" />
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-center mb-2">Join Nexus</h2>
                <p className="text-center text-muted-foreground mb-10">Start your journey today</p>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm mb-6"
                  >
                    {error}
                  </motion.div>
                )}

                <form onSubmit={submit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-emerald-500/50 transition-all text-sm"
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-emerald-500/50 transition-all text-sm"
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-emerald-500/50 transition-all text-sm"
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                      />
                    </div>
                  </div>

                  <button
                    disabled={loading}
                    className="w-full btn-premium"
                  >
                    <span className={cn("btn-premium-inner gap-2 bg-emerald-950", loading && "opacity-50")}>
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                        <>
                          Create Account
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </span>
                  </button>
                </form>

                <div className="mt-10 text-center">
                  <p className="text-sm text-muted-foreground">
                    Already part of the nexus? <Link to="/login" className="text-emerald-500 font-bold hover:underline">Sign In</Link>
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="flex justify-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30"
                  >
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  </motion.div>
                </div>
                <h2 className="text-3xl font-bold mb-4">Identity Verified</h2>
                <p className="text-muted-foreground mb-10">Your account has been successfully synchronized with the nexus.</p>
                <Link to="/login" className="btn-premium w-full inline-block">
                  <span className="btn-premium-inner bg-emerald-950">Proceed to Login</span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
