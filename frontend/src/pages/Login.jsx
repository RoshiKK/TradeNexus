import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { User, Lock, Mail, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

export default function Login({ setAuth }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/api/users/login", form);
      setAuth(data.token, data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[120px] rounded-full -z-10" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-card relative overflow-hidden border-white/10">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-primary" />
          
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center mb-2">Welcome Back</h2>
          <p className="text-center text-muted-foreground mb-10">Access your TradeNexus ecosystem</p>

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
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary/50 transition-all text-sm"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Password</label>
                <Link to="#" className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest">Forgot?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary/50 transition-all text-sm"
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full btn-premium"
            >
              <span className={cn("btn-premium-inner gap-2", loading && "opacity-50")}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </span>
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm text-muted-foreground">
              New to the nexus? <Link to="/register" className="text-primary font-bold hover:underline">Create an account</Link>
            </p>
          </div>
        </div>
        
        <p className="mt-8 text-center text-xs text-slate-600">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
}
