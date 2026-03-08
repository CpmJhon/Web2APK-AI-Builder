// app/builder/page.tsx
'use client'

import { BuilderForm } from '@/components/builder-form'
import { motion } from 'framer-motion'

export default function BuilderPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="gradient-bg fixed inset-0 pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative"
      >
        {/* Header */}
        <header className="glassmorphism border-b border-purple-500/20">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold gradient-text">Web2APK Builder</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">Free Plan: 2 builds left</span>
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-sm font-semibold">
                Upgrade
              </button>
            </div>
          </div>
        </header>

        {/* Builder Form */}
        <BuilderForm />
      </motion.div>
    </div>
  )
}