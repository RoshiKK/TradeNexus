import { Link, Route, Routes, useParams, useNavigate } from "react-router-dom";
import {
  FaShoppingCart, FaBoxOpen, FaTruck, FaCheckCircle, FaTimesCircle,
  FaSignOutAlt, FaUser, FaShieldAlt, FaChartBar, FaSearch, FaBolt
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "./api";

/* ─────────────── Hooks ─────────────── */
const useAuth = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userInfo, setUserInfo] = useState(() => {
    try { return JSON.parse(localStorage.getItem("userInfo")) || null; }
    catch { return null; }
  });
  const setAuth = (nextToken, info) => {
    if (nextToken) {
      localStorage.setItem("token", nextToken);
      localStorage.setItem("userInfo", JSON.stringify(info || {}));
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
    }
    setToken(nextToken);
    setUserInfo(info || null);
  };
  return { token, userInfo, setAuth };
};

const useCart = () => {
  const [items, setItems] = useState([]);
  const add = (product) =>
    setItems((prev) => {
      const existing = prev.find((p) => p._id === product._id);
      if (existing) return prev.map((p) => (p._id === product._id ? { ...p, qty: p.qty + 1 } : p));
      return [...prev, { ...product, qty: 1 }];
    });
  const remove = (id) => setItems((prev) => prev.filter((p) => p._id !== id));
  const clear = () => setItems([]);
  return { items, add, remove, clear };
};

/* ─────────────── Shared UI ─────────────── */
const GlassCard = ({ children, className = "" }) => (
  <div className={`glass-card ${className}`}>{children}</div>
);

const StatusBadge = ({ status }) => {
  const map = {
    Pending: "badge-warning", Shipped: "badge-info",
    Delivered: "badge-success", Cancelled: "badge-danger",
    success: "badge-success", failed: "badge-danger",
  };
  return <span className={`badge ${map[status] || "badge-neutral"}`}>{status}</span>;
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.45, ease: "easeOut" } })
};

/* ─────────────── Home / Products ─────────────── */
function Home({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/products")
      .then((r) => setProducts(r.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="hero-section mb-10">
        <div className="hero-content">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}>
            <span className="hero-badge"><FaBolt className="inline mr-1" /> Premium Marketplace</span>
          </motion.div>
          <h1 className="hero-title">Trade<span className="text-gradient">Nexus</span></h1>
          <p className="hero-sub">Discover premium products at unbeatable prices with lightning-fast delivery.</p>
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              className="search-input"
              placeholder="Search products…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="spinner" />
        </div>
      ) : (
        <div className="products-grid">
          {filtered.map((p, i) => (
            <motion.div
              key={p._id}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -6, scale: 1.02 }}
              className="product-card"
            >
              <div className="product-badge">${p.price}</div>
              <div className="product-image-container">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.title} className="product-img" />
                ) : (
                  <div className="product-icon-wrap">
                    <FaBoxOpen className="product-icon" />
                  </div>
                )}
              </div>
              <h3 className="product-title">{p.title}</h3>
              <p className="product-desc">{p.description}</p>
              <div className="product-footer">
                <span className="stock-info">Stock: {p.stock}</span>
                <div className="product-actions">
                  <Link to={`/products/${p._id}`} className="btn-ghost">Details</Link>
                  <button onClick={() => addToCart(p)} className="btn-primary">
                    <FaShoppingCart className="inline mr-1" /> Add
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="empty-state col-span-3">
              <FaSearch className="empty-icon" />
              <p>No products found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─────────────── Product Details ─────────────── */
function ProductDetails({ addToCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  useEffect(() => {
    api.get(`/api/products/${id}`).then((r) => setProduct(r.data)).catch(() => setProduct(null));
  }, [id]);

  if (!product) return (
    <div className="flex justify-center items-center h-64"><div className="spinner" /></div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
      <GlassCard className="max-w-2xl mx-auto">
        <div className="detail-image-container">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.title} className="detail-img" />
          ) : (
            <div className="detail-icon-wrap">
              <FaBoxOpen className="detail-icon" />
            </div>
          )}
        </div>
        <h2 className="detail-title">{product.title}</h2>
        <p className="detail-desc">{product.description}</p>
        <div className="detail-meta">
          <div className="meta-item">
            <span className="meta-label">Price</span>
            <span className="meta-value text-gradient">${product.price}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">In Stock</span>
            <span className="meta-value">{product.stock} units</span>
          </div>
        </div>
        <button onClick={() => addToCart(product)} className="btn-primary w-full mt-6">
          <FaShoppingCart className="inline mr-2" /> Add to Cart
        </button>
      </GlassCard>
    </motion.div>
  );
}

/* ─────────────── Login ─────────────── */
function Login({ setAuth }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const { data } = await api.post("/api/users/login", form);
      setAuth(data.token, data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="auth-wrapper">
      <GlassCard className="auth-card">
        <div className="auth-icon-wrap"><FaUser className="auth-icon" /></div>
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-sub">Sign in to your TradeNexus account</p>
        {error && <div className="alert-error">{error}</div>}
        <form onSubmit={submit} className="space-y-4 mt-6">
          <input className="input-field" placeholder="Email address" type="email"
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="input-field" placeholder="Password" type="password"
            onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button className="btn-primary w-full" disabled={loading}>
            {loading ? <span className="spinner-sm" /> : "Sign In"}
          </button>
        </form>
        <p className="auth-footer">
          No account? <Link to="/register" className="text-link">Register here</Link>
        </p>
      </GlassCard>
    </motion.div>
  );
}

/* ─────────────── Register ─────────────── */
function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await api.post("/api/users/register", form);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="auth-wrapper">
      <GlassCard className="auth-card">
        <div className="auth-icon-wrap" style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}>
          <FaUser className="auth-icon" />
        </div>
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-sub">Join TradeNexus today</p>
        {error && <div className="alert-error">{error}</div>}
        {success && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="alert-success">
            <FaCheckCircle className="inline mr-2" /> Account created! <Link to="/login" className="text-link">Login now</Link>
          </motion.div>
        )}
        {!success && (
          <form onSubmit={submit} className="space-y-4 mt-6">
            <input className="input-field" placeholder="Full Name"
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="input-field" placeholder="Email address" type="email"
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className="input-field" placeholder="Password" type="password"
              onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <button className="btn-success w-full" disabled={loading}>
              {loading ? <span className="spinner-sm" /> : "Create Account"}
            </button>
          </form>
        )}
        <p className="auth-footer">
          Have an account? <Link to="/login" className="text-link">Sign in</Link>
        </p>
      </GlassCard>
    </motion.div>
  );
}

/* ─────────────── Cart ─────────────── */
function Cart({ items, remove }) {
  const total = items.reduce((acc, item) => acc + item.qty * item.price, 0);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <GlassCard className="max-w-2xl mx-auto">
        <h2 className="section-title"><FaShoppingCart className="inline mr-2" />Your Cart</h2>
        {items.length === 0 ? (
          <div className="empty-state">
            <FaShoppingCart className="empty-icon" />
            <p>Your cart is empty</p>
            <Link to="/" className="btn-primary mt-4 inline-block">Browse Products</Link>
          </div>
        ) : (
          <>
            <div className="cart-list">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div key={item._id} layout exit={{ opacity: 0, x: -20 }} className="cart-item">
                    <div className="cart-item-info">
                      <span className="cart-item-name">{item.title}</span>
                      <span className="cart-item-qty">× {item.qty}</span>
                    </div>
                    <div className="cart-item-right">
                      <span className="cart-item-price">${(item.qty * item.price).toFixed(2)}</span>
                      <button onClick={() => remove(item._id)} className="btn-danger-sm">
                        <FaTimesCircle />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="cart-total">
              <span>Total</span>
              <span className="text-gradient text-2xl font-bold">${total.toFixed(2)}</span>
            </div>
            <Link to="/checkout" className="btn-primary w-full mt-4 text-center block">
              Proceed to Checkout
            </Link>
          </>
        )}
      </GlassCard>
    </motion.div>
  );
}

/* ─────────────── Checkout ─────────────── */
function Checkout({ items, clear }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState("JazzCash");

  const pay = async () => {
    if (!items.length) return;
    setLoading(true);
    try {
      // In a real app, we would send the 'method' to the payment service
      const payload = { 
        productId: items[0]._id, 
        quantity: items[0].qty,
        paymentMethod: method 
      };
      const { data } = await api.post("/api/orders", payload);
      setResult(data);
      if (data.paymentStatus === "success") clear();
    } finally { setLoading(false); }
  };

  const methods = [
    { id: "JazzCash", color: "#d97706", icon: "JC" },
    { id: "EasyPaisa", color: "#059669", icon: "EP" },
    { id: "Bank", color: "#2563eb", icon: "🏦" }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <GlassCard className="max-w-xl mx-auto">
        <h2 className="section-title">Checkout</h2>
        <div className="checkout-items mb-6">
          {items.map(item => (
            <div key={item._id} className="checkout-item flex justify-between text-sm py-1 border-b border-white/5">
              <span>{item.title} × {item.qty}</span>
              <span className="font-semibold">${(item.qty * item.price).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <h3 className="text-sm font-semibold uppercase text-slate-400 mb-4">Select Payment Method</h3>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {methods.map(m => (
            <button 
              key={m.id}
              onClick={() => setMethod(m.id)}
              className={`payment-method-card ${method === m.id ? 'active' : ''}`}
            >
              <div className="payment-icon" style={{ backgroundColor: m.color }}>{m.icon}</div>
              <span>{m.id}</span>
            </button>
          ))}
        </div>

        {method === "Bank" && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bank-details-box">
            <p className="text-xs text-slate-400 mb-1">Bank Account Transfer</p>
            <p className="text-sm font-mono text-blue-300">IBAN: PK72 BANK 0001 2345 6789</p>
          </motion.div>
        )}

        <button onClick={pay} disabled={loading || !items.length} className="btn-primary w-full mt-6">
          {loading ? <span className="spinner-sm" /> : `Pay with ${method}`}
        </button>
        
        {result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="result-card">
            <div className="result-row">
              <span>Order Status</span>
              <StatusBadge status={result.status} />
            </div>
            <div className="result-row">
              <span>Payment</span>
              <StatusBadge status={result.paymentStatus} />
            </div>
            {result.paymentStatus === "success" && (
              <Link to="/tracking" className="btn-success w-full mt-4 block text-center">Track My Order</Link>
            )}
          </motion.div>
        )}
      </GlassCard>
    </motion.div>
  );
}

/* ─────────────── Tracking ─────────────── */
function Tracking() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/orders");
      setOrders(data);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const iconMap = {
    Pending: <FaBoxOpen className="text-yellow-400" />,
    Shipped: <FaTruck className="text-blue-400" />,
    Delivered: <FaCheckCircle className="text-green-400" />,
    Cancelled: <FaTimesCircle className="text-red-400" />,
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="section-header">
        <h2 className="section-title"><FaTruck className="inline mr-2" />Order Tracking</h2>
        <button onClick={load} disabled={loading} className="btn-ghost">
          {loading ? <span className="spinner-sm" /> : "↻ Refresh"}
        </button>
      </div>
      {orders.length === 0 && !loading && (
        <div className="empty-state">
          <FaBoxOpen className="empty-icon" />
          <p>No orders yet. <Link to="/" className="text-link">Start shopping!</Link></p>
        </div>
      )}
      <div className="orders-list">
        {orders.map((o, i) => (
          <motion.div key={o._id} custom={i} variants={fadeUp} initial="hidden" animate="visible" className="order-card">
            <div className="order-icon">{iconMap[o.status] || <FaBoxOpen />}</div>
            <div className="order-info">
              <span className="order-id">#{o._id.slice(-8).toUpperCase()}</span>
              <span className="order-date">{new Date(o.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="order-meta">
              <StatusBadge status={o.status} />
              <StatusBadge status={o.paymentStatus} />
            </div>
            <div className="order-amount">${o.totalPrice?.toFixed(2)}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─────────────── Admin Dashboard ─────────────── */
function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState("users");
  const [loading, setLoading] = useState(false);

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

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="admin-header">
        <h2 className="section-title"><FaShieldAlt className="inline mr-2 text-purple-400" />Admin Dashboard</h2>
        <div className="stat-grid">
          <div className="stat-card">
            <FaUser className="stat-icon text-blue-400" />
            <div><div className="stat-value">{users.length}</div><div className="stat-label">Total Users</div></div>
          </div>
          <div className="stat-card">
            <FaBoxOpen className="stat-icon text-purple-400" />
            <div><div className="stat-value">{orders.length}</div><div className="stat-label">Total Orders</div></div>
          </div>
          <div className="stat-card">
            <FaChartBar className="stat-icon text-green-400" />
            <div>
              <div className="stat-value">${orders.reduce((a, o) => a + (o.totalPrice || 0), 0).toFixed(0)}</div>
              <div className="stat-label">Revenue</div>
            </div>
          </div>
        </div>
      </div>

      <div className="tab-bar">
        <button className={`tab-btn ${tab === "users" ? "tab-active" : ""}`} onClick={() => setTab("users")}>
          <FaUser className="inline mr-1" /> Users
        </button>
        <button className={`tab-btn ${tab === "orders" ? "tab-active" : ""}`} onClick={() => setTab("orders")}>
          <FaBoxOpen className="inline mr-1" /> Orders
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center h-32 items-center"><div className="spinner" /></div>
      ) : tab === "users" ? (
        <GlassCard>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="font-semibold">{u.name}</td>
                    <td className="text-slate-300">{u.email}</td>
                    <td><span className={`badge ${u.role === "admin" ? "badge-warning" : "badge-neutral"}`}>{u.role}</span></td>
                    <td className="text-slate-400 text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && <div className="empty-state"><p>No users found</p></div>}
          </div>
        </GlassCard>
      ) : (
        <GlassCard>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Order ID</th><th>User</th><th>Total</th><th>Status</th><th>Payment</th><th>Date</th></tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id}>
                    <td className="font-mono text-xs text-slate-300">#{o._id.slice(-8).toUpperCase()}</td>
                    <td className="text-slate-300">{o.userId?.name || o.userId || "—"}</td>
                    <td className="font-semibold text-green-400">${o.totalPrice?.toFixed(2)}</td>
                    <td><StatusBadge status={o.status} /></td>
                    <td><StatusBadge status={o.paymentStatus} /></td>
                    <td className="text-slate-400 text-sm">{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && <div className="empty-state"><p>No orders found</p></div>}
          </div>
        </GlassCard>
      )}
    </motion.div>
  );
}

/* ─────────────── App Shell ─────────────── */
export default function App() {
  const auth = useAuth();
  const cart = useCart();

  return (
    <div className="app-bg">
      {/* Navbar */}
      <header className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="nav-brand">
            <FaBolt className="brand-icon" />
            Trade<span className="text-gradient">Nexus</span>
          </Link>
          <nav className="nav-links">
            <Link to="/tracking" className="nav-link"><FaTruck className="inline mr-1" />Track</Link>
            {auth.userInfo?.role === "admin" && (
              <Link to="/admin" className="nav-link nav-admin">
                <FaShieldAlt className="inline mr-1" />Admin
              </Link>
            )}
            <Link to="/cart" className="nav-cart">
              <FaShoppingCart />
              {cart.items.length > 0 && <span className="cart-badge">{cart.items.length}</span>}
            </Link>
            {auth.token ? (
              <button onClick={() => auth.setAuth(null, null)} className="btn-logout">
                <FaSignOutAlt className="inline mr-1" />Logout
              </button>
            ) : (
              <Link to="/login" className="btn-nav-login">Sign In</Link>
            )}
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="main-content">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home addToCart={cart.add} />} />
            <Route path="/products/:id" element={<ProductDetails addToCart={cart.add} />} />
            <Route path="/cart" element={<Cart items={cart.items} remove={cart.remove} />} />
            <Route path="/checkout" element={<Checkout items={cart.items} clear={cart.clear} />} />
            <Route path="/tracking" element={<Tracking />} />
            <Route path="/login" element={<Login setAuth={auth.setAuth} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 TradeNexus</p>
      </footer>
    </div>
  );
}
