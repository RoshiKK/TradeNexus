import { Link } from "react-router-dom";
import { ShoppingCart, Truck, ShieldAlert, LogOut, User, Zap, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "../lib/utils";

export default function Navbar({ auth, cartItemsCount }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Track Order", icon: Truck, path: "/tracking" },
    ...(auth.userInfo?.role === "admin" ? [{ name: "Admin", icon: ShieldAlert, path: "/admin" }] : []),
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled 
          ? "bg-background/80 backdrop-blur-xl border-white/10 py-3" 
          : "bg-transparent border-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-xl bg-primary/20 group-hover:bg-primary/30 transition-colors">
            <Zap className="w-6 h-6 text-primary" fill="currentColor" />
          </div>
          <span className="text-2xl font-bold tracking-tight">
            Trade<span className="text-gradient">Nexus</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              <link.icon className="w-4 h-4" />
              {link.name}
            </Link>
          ))}
          
          <div className="h-6 w-px bg-white/10 mx-2" />

          <Link to="/cart" className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
            <ShoppingCart className="w-6 h-6" />
            <AnimatePresence>
              {cartItemsCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-[10px] font-bold text-white flex items-center justify-center rounded-full border-2 border-background"
                >
                  {cartItemsCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {auth.token ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <User className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium">{auth.userInfo?.name || "User"}</span>
              </div>
              <button
                onClick={() => auth.setAuth(null, null)}
                className="p-2 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="btn-premium"
            >
              <span className="btn-premium-inner">Sign In</span>
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-muted-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-2xl border-b border-white/10 overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-4 text-lg font-medium"
                >
                  <link.icon className="text-primary" />
                  {link.name}
                </Link>
              ))}
              <Link
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-4 text-lg font-medium"
              >
                <ShoppingCart className="text-primary" />
                Cart ({cartItemsCount})
              </Link>
              <div className="h-px w-full bg-white/10" />
              {auth.token ? (
                <button
                  onClick={() => { auth.setAuth(null, null); setMobileMenuOpen(false); }}
                  className="flex items-center gap-4 text-lg font-medium text-destructive"
                >
                  <LogOut />
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-4 rounded-2xl bg-primary text-white font-bold"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
