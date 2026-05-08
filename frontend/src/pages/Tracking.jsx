import { useState, useEffect } from "react";
import { api } from "../api";
import { Truck, Package, CheckCircle2, Clock, MapPin, RefreshCcw, Search, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

export default function Tracking() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/orders");
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const statusConfig = {
    Pending: { color: "text-yellow-500", bg: "bg-yellow-500/10", icon: Clock, label: "Processing" },
    Shipped: { color: "text-blue-500", bg: "bg-blue-500/10", icon: Truck, label: "In Transit" },
    Delivered: { color: "text-emerald-500", bg: "bg-emerald-500/10", icon: CheckCircle2, label: "Completed" },
    Cancelled: { color: "text-red-500", bg: "bg-red-500/10", icon: Package, label: "Voided" },
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Order Tracking</h1>
          <p className="text-muted-foreground">Monitor the synchronization of your physical goods.</p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="btn-premium px-8"
        >
          <span className="btn-premium-inner gap-2">
            {loading ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
            Refresh Stream
          </span>
        </button>
      </div>

      {orders.length === 0 && !loading ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card flex flex-col items-center justify-center py-24"
        >
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <Search className="w-10 h-10 text-slate-700" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No active orders</h2>
          <p className="text-muted-foreground mb-8">Start exploring the nexus to place your first order.</p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {orders.map((order, i) => {
              const cfg = statusConfig[order.status] || statusConfig.Pending;
              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card hover:border-white/20 transition-all p-0 overflow-hidden"
                >
                  <div className="p-6 flex flex-col md:flex-row gap-8">
                    {/* Status Icon */}
                    <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0", cfg.bg, cfg.color)}>
                      <cfg.icon className="w-8 h-8" />
                    </div>

                    {/* Order Details */}
                    <div className="flex-1 flex flex-col md:flex-row justify-between gap-6">
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Order Identifier</div>
                        <h3 className="text-xl font-bold tracking-tight mb-4 font-mono">#{order._id.slice(-12).toUpperCase()}</h3>
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <Clock className="w-4 h-4" /> {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <MapPin className="w-4 h-4" /> Standard Protocol
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4">
                        <div className="text-right">
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Status Stream</div>
                          <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border", cfg.bg, cfg.color, "border-current/20")}>
                            {cfg.label}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Value</div>
                          <div className="text-2xl font-black text-gradient">${order.totalPrice?.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar Container */}
                  <div className="h-1.5 w-full bg-white/5 relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: order.status === 'Delivered' ? '100%' : order.status === 'Shipped' ? '66%' : '33%' }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={cn("absolute top-0 left-0 h-full", 
                        order.status === 'Delivered' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 
                        order.status === 'Shipped' ? 'bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 
                        'bg-yellow-500 shadow-[0_0_10px_#eab308]'
                      )}
                    />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
