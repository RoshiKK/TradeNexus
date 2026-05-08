import { useState, useEffect } from "react";
import { api } from "../api";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import { Loader2, SearchX } from "lucide-react";
import { motion } from "framer-motion";

export default function Home({ addToCart }) {
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
      <Hero search={search} setSearch={setSearch} />

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight mb-2">Featured Products</h2>
            <p className="text-muted-foreground">Handpicked selections for your digital lifestyle.</p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-slate-400">
            Showing {filtered.length} results
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Synchronizing with the nexus...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((product, index) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={addToCart}
                index={index}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-40 glass-card"
          >
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <SearchX className="w-10 h-10 text-slate-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No items found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms or filters.</p>
          </motion.div>
        )}
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: "Active Users", value: "2M+" },
            { label: "Products Sold", value: "15M+" },
            { label: "Countries", value: "120+" },
            { label: "Success Rate", value: "99.9%" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl font-black text-gradient mb-2">{stat.value}</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
