import { motion } from "framer-motion";
import { Zap, ArrowRight, Search } from "lucide-react";

export default function Hero({ search, setSearch }) {
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Mesh Gradients */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
        >
          <Zap className="w-4 h-4 text-primary fill-primary" />
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-300">New Collection 2026</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-6xl md:text-8xl font-extrabold tracking-tight mb-6"
        >
          Future of <br />
          <span className="text-gradient">E-Commerce</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          Experience the next generation marketplace. Seamless, secure, and futuristic. Discover premium products curated just for you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative max-w-lg mx-auto group"
        >
          <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/30 transition-all duration-500 -z-10" />
          <div className="flex items-center gap-4 p-2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl">
            <div className="pl-4">
              <Search className="w-5 h-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Search the nexus..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-white placeholder:text-slate-500 py-3"
            />
            <button className="bg-primary hover:bg-primary/90 text-white p-3 rounded-xl transition-all">
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-[20%] right-[15%] hidden lg:block">
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-24 h-24 rounded-3xl glass border-primary/20 rotate-12 flex items-center justify-center shadow-primary/20 shadow-2xl"
        >
          <Zap className="w-10 h-10 text-primary" />
        </motion.div>
      </div>
      
      <div className="absolute bottom-[20%] left-[10%] hidden lg:block">
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="w-16 h-16 rounded-2xl glass border-purple-500/20 -rotate-12 flex items-center justify-center shadow-purple-500/20 shadow-2xl"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary to-purple-500" />
        </motion.div>
      </div>
    </div>
  );
}
