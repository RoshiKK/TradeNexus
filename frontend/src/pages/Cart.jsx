import { Link } from "react-router-dom";
import { ShoppingCart, Trash2, ArrowRight, ShoppingBag, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Cart({ items, remove, token }) {
  const total = items.reduce((acc, item) => acc + item.qty * item.price, 0);
  const shipping = total > 0 ? 10 : 0;
  const tax = total * 0.1;

  return (
    <div className="max-w-7xl mx-auto px-6 py-32">
      <div className="flex items-center gap-4 mb-12">
        <div className="p-3 rounded-2xl bg-primary/20 border border-primary/30 text-primary">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Your Cart</h1>
          <p className="text-muted-foreground">Review your selection before finalizing.</p>
        </div>
      </div>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card flex flex-col items-center justify-center py-24"
        >
          <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-8">
            <ShoppingCart className="w-12 h-12 text-slate-700" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-10 max-w-sm text-center">
            Looks like you haven't added anything to your cart yet. Explore our collection to find something special.
          </p>
          <Link to="/" className="btn-premium">
            <span className="btn-premium-inner">Start Shopping</span>
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="glass-card flex items-center gap-6 p-4 border-white/5 hover:border-white/10 transition-all"
                >
                  <div className="w-24 h-24 rounded-xl bg-slate-900 overflow-hidden flex-shrink-0">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-700">
                        <ShoppingBag />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1 mb-4">{item.description}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-white/5 border border-white/10">
                        <button className="p-1 hover:text-primary"><Minus className="w-3 h-3" /></button>
                        <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                        <button className="p-1 hover:text-primary"><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-4">
                    <span className="text-xl font-bold text-gradient">${(item.qty * item.price).toFixed(2)}</span>
                    <button
                      onClick={() => remove(item._id)}
                      className="p-2 rounded-lg hover:bg-destructive/10 text-slate-500 hover:text-destructive transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="space-y-6">
            <div className="glass-card sticky top-32 border-primary/20">
              <h3 className="text-2xl font-bold mb-8">Order Summary</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-medium text-white">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Shipping</span>
                  <span className="font-medium text-white">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Estimated Tax</span>
                  <span className="font-medium text-white">${tax.toFixed(2)}</span>
                </div>
                <div className="pt-4 border-t border-white/5 flex justify-between items-end">
                  <span className="text-lg font-bold">Total</span>
                  <div className="text-right">
                    <div className="text-3xl font-black text-gradient">${(total + shipping + tax).toFixed(2)}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Including VAT</div>
                  </div>
                </div>
              </div>

              {token ? (
                <Link to="/checkout" className="btn-premium w-full">
                  <span className="btn-premium-inner gap-2">
                    Checkout <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              ) : (
                <div className="space-y-4">
                  <Link to="/login" className="btn-premium w-full">
                    <span className="btn-premium-inner">Login to Checkout</span>
                  </Link>
                  <p className="text-[10px] text-center text-slate-500 uppercase tracking-widest font-bold">Authentication Required</p>
                </div>
              )}
            </div>
            
            {/* Promo Code */}
            <div className="glass-card p-4 flex gap-2">
              <input 
                placeholder="Promo Code" 
                className="flex-1 bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-xs outline-none focus:border-primary/50" 
              />
              <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">Apply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
