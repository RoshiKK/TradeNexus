import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingCart, Eye, Package } from "lucide-react";
import { cn } from "../lib/utils";

export default function ProductCard({ product, onAddToCart, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className="group relative flex flex-col glass-card border-white/5 hover:border-primary/50 overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-10 transition duration-500" />
      
      {/* Product Image */}
      <div className="relative h-64 w-full rounded-xl overflow-hidden mb-6 bg-slate-900/50 flex items-center justify-center">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <Package className="w-16 h-16 text-slate-700" />
        )}
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          <Link
            to={`/products/${product._id}`}
            className="p-3 rounded-full bg-white text-black hover:bg-primary hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300"
          >
            <Eye className="w-5 h-5" />
          </Link>
          <button
            onClick={() => onAddToCart(product)}
            className="p-3 rounded-full bg-primary text-white hover:bg-white hover:text-black transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>

        {/* Price Badge */}
        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full glass border-white/20 text-sm font-bold text-white z-10">
          ${product.price}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
            {product.title}
          </h3>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-6">
          {product.description}
        </p>
        
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
          <span className={cn(
            "text-xs font-medium px-2 py-1 rounded-md",
            product.stock > 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
          )}>
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </span>
          <button
            onClick={() => onAddToCart(product)}
            className="text-sm font-bold text-primary flex items-center gap-1 hover:underline"
          >
            Add to cart
          </button>
        </div>
      </div>
    </motion.div>
  );
}
