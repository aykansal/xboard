"use client"
import ActivityDashboard from "@/components/ActivityDashboard"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="relative">
        {/* Add decorative background elements */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-[300px] w-[300px] bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-[100px] rounded-full" />
        </div>
        
        <div className="relative px-4 py-16 container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ActivityDashboard />
          </motion.div>
        </div>
      </div>
    </main>
  )
}

