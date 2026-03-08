// components/hero-section.tsx
'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Github, Zap } from 'lucide-react'
import Link from 'next/link'
import { NeonButton } from './ui/neon-button'

export function HeroSection() {
  return (
    <section className="relative px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 glassmorphism rounded-full">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-gray-300">AI-Powered WebView Builder</span>
        </div>
        
        <h1 className="text-5xl font-bold tracking-tight sm:text-7xl md:text-8xl">
          <span className="gradient-text">Convert Any Website</span>
          <br />
          <span className="text-white">Into Android App</span>
        </h1>
        
        <p className="max-w-2xl mx-auto mt-6 text-xl text-gray-400">
          Transform websites into professional Android apps instantly. 
          AI-powered analysis, advanced WebView features, and one-click APK generation.
        </p>
        
        <div className="flex flex-col items-center justify-center gap-4 mt-10 sm:flex-row">
          <Link href="/builder">
            <NeonButton size="lg" className="group">
              Start Building Free
              <ArrowRight className="inline-block w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </NeonButton>
          </Link>
          
          <Link href="/github-connect">
            <NeonButton variant="secondary" size="lg">
              <Github className="w-5 h-5 mr-2" />
              Connect GitHub
            </NeonButton>
          </Link>
        </div>
        
        <div className="flex items-center justify-center gap-8 mt-12 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-400" />
            <span>No coding required</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-400" />
            <span>AI-powered analysis</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-400" />
            <span>Instant APK download</span>
          </div>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="relative mt-20"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-3xl opacity-20" />
        <div className="relative glassmorphism rounded-3xl p-2">
          <img
            src="/app-preview.png"
            alt="App Preview"
            className="w-full rounded-2xl"
          />
        </div>
      </motion.div>
    </section>
  )
}