import { useEffect, useState } from "react";
import { api } from "../api";
import { 
  Users, Package, DollarSign, ShieldCheck, 
  ChevronRight, ArrowUpRight, ArrowDownRight,
  LayoutDashboard, Search, Filter, Loader2, Calendar,
  Plus, X, Trash2, Edit3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [tab, setTab] = useState("users");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: "", description: "", price: "", stock: "", imageUrl: ""
  });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [uRes, oRes, pRes] = await Promise.all([
        api.get("/api/users/admin/all-users"),
        api.get("/api/orders/admin/all"),
        api.get("/api/products")
      ]);
      setUsers(uRes.data);
      setOrders(oRes.data);
      setProducts(pRes.data);
    } catch (e) {
      console.error("Nexus Sync Error:", e);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/products", newProduct);
      setShowAddModal(false);
      setNewProduct({ title: "", description: "", price: "", stock: "", imageUrl: "" });
      fetchAll();
    } catch (err) {
      alert("Failed to add product: " + err.message);
    }
  };

  const stats = [
    { label: "Total Users", value: users.length, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", trend: "+12.5%", positive: true },
    { label: "Total Orders", value: orders.length, icon: Package, color: "text-purple-500", bg: "bg-purple-500/10", trend: "+8.2%", positive: true },
    { label: "Revenue", value: `$${orders.reduce((a, o) => a + (o.totalPrice || 0), 0).toFixed(0)}`, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10", trend: "+24.1%", positive: true },
    { label: "Inventory", value: products.length, icon: LayoutDashboard, color: "text-primary", bg: "bg-primary/10", trend: "+5.4%", positive: true },
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
          <button 
            onClick={fetchAll}
            className="p-3 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-primary hover:border-primary/30 transition-all group"
            title="Refresh Data"
          >
            <Loader2 className={cn("w-5 h-5", loading && "animate-spin")} />
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-premium px-8"
          >
            <span className="btn-premium-inner gap-2">
              <Plus className="w-4 h-4" /> Add Product
            </span>
          </button>
        </div>
      </div>
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
      <div className="grid grid-cols-1 gap-8">
        <div className="glass-card border-white/5 p-0 overflow-hidden">
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
              <button 
                onClick={() => setTab("catalog")}
                className={cn(
                  "text-sm font-bold uppercase tracking-widest pb-6 -mb-6 border-b-2 transition-all",
                  tab === "catalog" ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-300"
                )}
              >
                Inventory Catalog
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
            ) : tab === "orders" ? (
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
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.01]">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">Product</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">Inventory</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">Unit Price</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map((p) => (
                    <tr key={p._id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          <img src={p.imageUrl} className="w-10 h-10 rounded-lg object-cover bg-white/5" alt="" />
                          <div>
                            <div className="font-bold text-white group-hover:text-primary transition-colors">{p.title}</div>
                            <div className="text-xs text-slate-500 line-clamp-1">{p.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="text-sm text-slate-300 font-medium">{p.stock} units</div>
                      </td>
                      <td className="px-6 py-6 font-bold text-primary">${p.price}</td>
                      <td className="px-6 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-all">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-red-500 transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {!loading && (tab === 'users' ? users.length : tab === 'orders' ? orders.length : products.length) === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <p className="text-slate-500 font-medium">No records found in this stream.</p>
              </div>
            )}
          </div>
        </div>
      </div>


      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-xl glass-card border-white/10 p-8"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black">Add New Product</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 rounded-full hover:bg-white/5 text-slate-500">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleAddProduct} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Product Title</label>
                    <input 
                      required
                      className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-primary/50"
                      value={newProduct.title}
                      onChange={e => setNewProduct({...newProduct, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Description</label>
                    <textarea 
                      required
                      className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-primary/50 h-24"
                      value={newProduct.description}
                      onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Price ($)</label>
                      <input 
                        required type="number"
                        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-primary/50"
                        value={newProduct.price}
                        onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Initial Stock</label>
                      <input 
                        required type="number"
                        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-primary/50"
                        value={newProduct.stock}
                        onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Image URL</label>
                    <input 
                      required
                      placeholder="e.g., https://example.com/image.png"
                      className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-primary/50"
                      value={newProduct.imageUrl}
                      onChange={e => setNewProduct({...newProduct, imageUrl: e.target.value})}
                    />
                  </div>
                </div>

                <button type="submit" className="w-full btn-premium py-4">
                  <span className="btn-premium-inner">Confirm Nexus Synchronization</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

