"use client"
import ActivityDashboard from "@/components/ActivityDashboard"
import Footer from "@/components/Footer"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      <div className="relative">
        {/* Animated background grid */}
        <motion.div 
          className="absolute inset-0" 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
          style={{
            backgroundImage: `
              linear-gradient(to right, #1a1b26 1px, transparent 1px),
              linear-gradient(to bottom, #1a1b26 1px, transparent 1px)
            `,
            backgroundSize: '32px 32px',
          }}
        />
        
        {/* Animated decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rotate-45 pixel-borders"
            animate={{ rotate: [45, 55, 45] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-40 right-20 w-40 h-40 bg-purple-500/10 rotate-12 pixel-borders"
            animate={{ rotate: [12, 24, 12] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute top-1/2 left-1/3 w-24 h-24 bg-pink-500/10 -rotate-12 pixel-borders animate-glow"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Content container */}
        <div className="relative px-6 py-24 container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-12"
          >
            <ActivityDashboard />
          </motion.div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </main>
  )
}

