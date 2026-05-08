import { useEffect, useState } from "react";
import { api } from "../api";
import { 
  Users, Package, DollarSign, ShieldCheck, 
  ChevronRight, ArrowUpRight, ArrowDownRight,
  LayoutDashboard, Search, Filter, Loader2, Calendar
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState("users");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [uRes, oRes] = await Promise.all([
          api.get("/api/users/admin/all-users"),
          api.get("/api/users/admin/all-orders"),
        ]);
        setUsers(uRes.data);
        setOrders(oRes.data);
      } catch (e) {
        console.error(e);
      } finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const stats = [
    { label: "Total Users", value: users.length, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", trend: "+12.5%", positive: true },
    { label: "Total Orders", value: orders.length, icon: Package, color: "text-purple-500", bg: "bg-purple-500/10", trend: "+8.2%", positive: true },
    { label: "Revenue", value: `$${orders.reduce((a, o) => a + (o.totalPrice || 0), 0).toFixed(0)}`, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10", trend: "+24.1%", positive: true },
    { label: "Growth", value: "22%", icon: ArrowUpRight, color: "text-primary", bg: "bg-primary/10", trend: "+5.4%", positive: true },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div>
          <div className="flex items-center gap-3 text-primary mb-2">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest">Administrative Control</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Nexus Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span className="text-slate-300">May 2026</span>
          </div>
          <button className="btn-premium px-8">
            <span className="btn-premium-inner">Generate Report</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card border-white/5 hover:border-white/10"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-3 rounded-xl", stat.bg, stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={cn("flex items-center gap-1 text-[10px] font-bold", stat.positive ? "text-emerald-500" : "text-red-500")}>
                {stat.trend} {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              </div>
            </div>
            <div className="text-3xl font-black mb-1">{stat.value}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 gap-8">
        <div className="glass-card border-white/5 p-0 overflow-hidden">
          {/* Tab Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-8">
              <button 
                onClick={() => setTab("users")}
                className={cn(
                  "text-sm font-bold uppercase tracking-widest pb-6 -mb-6 border-b-2 transition-all",
                  tab === "users" ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-300"
                )}
              >
                Nexus Entities
              </button>
              <button 
                onClick={() => setTab("orders")}
                className={cn(
                  "text-sm font-bold uppercase tracking-widest pb-6 -mb-6 border-b-2 transition-all",
                  tab === "orders" ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-300"
                )}
              >
                Transaction Stream
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative group hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  placeholder="Query nexus..." 
                  className="bg-black/40 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-xs outline-none focus:border-primary/50 w-64"
                />
              </div>
              <button className="p-2 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white transition-all">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-0 overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-40">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-slate-500 font-medium tracking-tight">Syncing administrative data...</p>
              </div>
            ) : tab === "users" ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.01]">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">Entity</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">Access Level</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">Synchronization Date</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center font-bold text-sm">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-white group-hover:text-primary transition-colors">{u.name}</div>
                            <div className="text-xs text-slate-500">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                          u.role === "admin" ? "bg-primary/10 text-primary border-primary/20" : "bg-white/5 text-slate-400 border-white/10"
                        )}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-sm text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </td>
                      <td className="px-6 py-6 text-right">
                        <button className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-all">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.01]">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">Order Ref</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">Purchaser</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">Amount</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.map((o) => (
                    <tr key={o._id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-6 font-mono text-xs text-slate-400 group-hover:text-primary transition-colors">
                        #{o._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-6 py-6 text-sm text-slate-300">
                        {o.userId?.name || "System Entity"}
                      </td>
                      <td className="px-6 py-6">
                        <div className="font-bold text-emerald-500">${o.totalPrice?.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            o.status === 'Delivered' ? 'bg-emerald-500' : 'bg-yellow-500'
                          )} />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">{o.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <button className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-all">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {!loading && (tab === 'users' ? users.length : orders.length) === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <p className="text-slate-500 font-medium">No records found in this stream.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
