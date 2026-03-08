// components/preview-phone.tsx
'use client'

import { motion } from 'framer-motion'
import { Smartphone, Volume2, Wifi, Battery } from 'lucide-react'

interface PreviewPhoneProps {
  url?: string
  themeColor?: string
  splashScreen?: File | null
}

export function PreviewPhone({ url, themeColor = '#6366f1', splashScreen }: PreviewPhoneProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative mx-auto w-[300px] h-[600px] bg-black rounded-[40px] shadow-2xl border-4 border-gray-800 overflow-hidden"
    >
      {/* Dynamic Island */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120px] h-[30px] bg-black rounded-b-3xl z-20" />
      
      {/* Screen */}
      <div className="relative w-full h-full bg-gray-900 overflow-hidden">
        {/* Status Bar */}
        <div className="absolute top-0 left-0 right-0 z-10 flex justify-between px-6 py-2 text-white text-xs">
          <span>9:41</span>
          <div className="flex gap-1">
            <Wifi className="w-3 h-3" />
            <Volume2 className="w-3 h-3" />
            <Battery className="w-3 h-3" />
          </div>
        </div>

        {/* App Preview */}
        {splashScreen ? (
          <img
            src={URL.createObjectURL(splashScreen)}
            alt="Splash Screen"
            className="w-full h-full object-cover"
          />
        ) : url ? (
          <iframe
            src={url}
            className="w-full h-full border-0"
            style={{ marginTop: 40 }}
            title="App Preview"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full" style={{ backgroundColor: themeColor }}>
            <Smartphone className="w-16 h-16 text-white mb-4" />
            <p className="text-white text-center px-4">
              Enter a URL to see your app preview
            </p>
          </div>
        )}
      </div>

      {/* Home Button */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-[120px] h-1 bg-gray-600 rounded-full" />
    </motion.div>
  )
}