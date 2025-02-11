"use client"
import ActivityDashboard from "@/components/ActivityDashboard"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <main className="bg-gradient-to-b from-background to-muted/20 min-h-screen">
      <div className="px-4 py-16 container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ActivityDashboard />
        </motion.div>
      </div>
    </main>
  )
}

