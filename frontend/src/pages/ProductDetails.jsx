import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api";
import { ShoppingCart, Package, ArrowLeft, Loader2, Star, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

export default function ProductDetails({ addToCart, token }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/products/${id}`)
      .then((r) => setProduct(r.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
      <p className="text-slate-500 font-medium">Extracting data from nexus...</p>
    </div>
  );

  if (!product) return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-4xl font-black mb-4">Product Not Found</h2>
      <Link to="/" className="text-primary hover:underline flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Back to Nexus
      </Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-32">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors mb-12 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left: Image Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative group"
        >
          <div className="absolute -inset-4 bg-primary/20 blur-[60px] opacity-0 group-hover:opacity-40 transition-opacity duration-700 -z-10" />
          <div className="aspect-square rounded-3xl overflow-hidden glass border-white/5 flex items-center justify-center bg-slate-900/50">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
            ) : (
              <Package className="w-32 h-32 text-slate-700" />
            )}
          </div>
        </motion.div>

        {/* Right: Content */}
        <div className="flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/30">Premium Tier</span>
              <div className="flex items-center gap-1 text-yellow-500">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
              </div>
            </div>
            <h1 className="text-5xl font-black tracking-tight mb-4">{product.title}</h1>
            <div className="text-4xl font-black text-gradient mb-6">${product.price}</div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Availability</div>
              <div className="text-lg font-bold flex items-center gap-2">
                <span className={cn("w-2 h-2 rounded-full", product.stock > 0 ? "bg-emerald-500 animate-pulse" : "bg-red-500")} />
                {product.stock > 0 ? `${product.stock} Units In Stock` : "Temporarily Offline"}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Shipping</div>
              <div className="text-lg font-bold flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" /> Lightning Fast
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => addToCart(product)}
              className="w-full btn-premium py-8"
            >
              <span className="btn-premium-inner text-lg gap-3">
                <ShoppingCart className="w-6 h-6" /> Add to Shopping Cart
              </span>
            </button>
            
            {!token && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-bold text-center uppercase tracking-wider"
              >
                🔐 Authorization Required for Purchase
              </motion.div>
            )}
          </div>

          <div className="mt-12 pt-8 border-t border-white/5 grid grid-cols-3 gap-4">
            {[
              { icon: ShieldCheck, label: "Encrypted" },
              { icon: Package, label: "Insured" },
              { icon: Zap, label: "Priority" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <item.icon className="w-5 h-5 text-slate-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
