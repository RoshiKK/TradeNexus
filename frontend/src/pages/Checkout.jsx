import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { CreditCard, Wallet, Loader2, CheckCircle, Package, ArrowRight, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

export default function Checkout({ items, clear }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState("JazzCash");

  const pay = async () => {
    if (!items.length) return;
    setLoading(true);
    try {
      const payload = { 
        productId: items[0]._id, 
        quantity: items[0].qty,
        paymentMethod: method 
      };
      const { data } = await api.post("/api/orders", payload);
      setResult(data);
      if (data.paymentStatus === "success") clear();
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  const methods = [
    { id: "JazzCash", color: "#d97706", icon: Wallet, label: "JazzCash Digital" },
    { id: "EasyPaisa", color: "#059669", icon: CreditCard, label: "EasyPaisa Mobile" }
  ];

  // 1. Move the Success Screen to the VERY top so it stays visible even if items are cleared
  if (result && result.paymentStatus === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center py-20 px-6 bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--primary),0.05),transparent)] pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl w-full glass-card text-center border-emerald-500/20 p-12 relative z-10"
        >
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12 }}
            className="flex justify-center mb-10"
          >
            <div className="w-28 h-28 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
              <CheckCircle className="w-16 h-16 text-emerald-500" />
            </div>
          </motion.div>

          <h1 className="text-4xl font-black mb-4 tracking-tight">System Synchronized</h1>
          <p className="text-slate-400 mb-10 text-lg leading-relaxed">
            Your <span className="text-white font-bold">{method}</span> transaction was verified. Your order is now live on the distributed ledger.
          </p>
          
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 mb-10 text-left space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Transaction Ref</span>
              <span className="text-sm font-mono text-emerald-500 font-bold tracking-tighter">NX-{result._id.slice(-10).toUpperCase()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Payment Gateway</span>
              <span className="text-sm font-bold text-slate-200">{method} API v2.4</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-white/5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Network Status</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Confirmed</span>
              </div>
            </div>
          </div>

          <Link to="/tracking" className="btn-premium w-full group">
            <span className="btn-premium-inner gap-3 bg-emerald-950 py-5">
              Proceed to Tracking Hub <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-32">
      <div className="flex flex-col md:flex-row gap-12">
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold tracking-tight mb-8">Finalize Payment</h1>
          
          <div className="space-y-8">
            <section>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Package className="w-4 h-4" /> Review Items
              </h3>
              <div className="space-y-3">
                {items.map(item => (
                  <div key={item._id} className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-sm font-medium">{item.title} <span className="text-slate-500 ml-2">×{item.qty}</span></span>
                    <span className="font-bold text-sm">${(item.qty * item.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> Secure Checkout
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {methods.map(m => (
                  <button 
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left",
                      method === m.id 
                        ? "bg-primary/10 border-primary shadow-[0_0_20px_rgba(var(--primary),0.3)]" 
                        : "bg-white/5 border-white/5 hover:border-white/10"
                    )}
                  >
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                      style={{ backgroundColor: m.color }}
                    >
                      <m.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-sm">{m.id}</div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{m.label}</div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="w-full md:w-80">
          <div className="glass-card border-primary/20 p-8 sticky top-32">
            <h3 className="text-xl font-bold mb-8">Payment Details</h3>
            <div className="space-y-4 mb-10">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Service Fee</span>
                <span className="font-bold">$0.00</span>
              </div>
              <div className="flex justify-between items-end pt-4 border-t border-white/5">
                <span className="text-sm font-bold">Total Amount</span>
                <span className="text-2xl font-black text-gradient">${items.reduce((a, b) => a + (b.price * b.qty), 0).toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={pay} 
              disabled={loading || !items.length} 
              className="w-full btn-premium mb-6"
            >
              <span className="btn-premium-inner gap-2">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    Pay with {method}
                    <ShieldCheck className="w-4 h-4" />
                  </>
                )}
              </span>
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <ShieldCheck className="w-3 h-3 text-emerald-500" /> Secure Encryption Active
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
