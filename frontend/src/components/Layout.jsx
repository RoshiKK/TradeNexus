import { useEffect } from "react";
import Lenis from "lenis";
import Navbar from "./Navbar";
import { motion, AnimatePresence } from "framer-motion";

export default function Layout({ children, auth, cartItemsCount }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-background selection:bg-primary/30 selection:text-white">
      <Navbar auth={auth} cartItemsCount={cartItemsCount} />
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={window.location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      
      {/* Background Decor */}
      <div className="fixed inset-0 -z-50 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.02]" />
        <div className="absolute top-0 left-0 w-full h-full bg-dot-white/[0.05]" />
      </div>

      <footer className="py-20 border-t border-white/5 bg-black/20 mt-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <span className="text-2xl font-bold tracking-tight mb-4 block">
              Trade<span className="text-gradient">Nexus</span>
            </span>
            <p className="text-muted-foreground max-w-sm">
              The world's most advanced digital marketplace for premium goods. Powered by cutting-edge technology and a commitment to excellence.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-slate-500">Platform</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="hover:text-primary transition-colors cursor-pointer">Marketplace</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Security</li>
              <li className="hover:text-primary transition-colors cursor-pointer">API</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-slate-500">Company</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="hover:text-primary transition-colors cursor-pointer">About</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Contact</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Terms</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 text-center text-xs text-slate-600">
          © 2026 TradeNexus. All rights reserved. Designed for the future.
        </div>
      </footer>
    </div>
  );
}
