// components/builder-form.tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Upload, Globe, Smartphone, Sparkles } from 'lucide-react'
import { PreviewPhone } from './preview-phone'
import { analyzeWebsite } from '@/lib/website-analyzer'
import { NeonButton } from './ui/neon-button'

const formSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
  appName: z.string().min(3, 'App name must be at least 3 characters'),
  packageName: z.string().regex(/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/, 'Invalid package name'),
  themeColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  enableFileDownload: z.boolean(),
  enableFileUpload: z.boolean(),
  enableFullscreenVideo: z.boolean(),
  enablePushNotifications: z.boolean(),
  enableOfflineMode: z.boolean(),
})

type FormData = z.infer<typeof formSchema>

export function BuilderForm() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [iconFile, setIconFile] = useState<File | null>(null)
  const [splashFile, setSplashFile] = useState<File | null>(null)
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      enableFileDownload: true,
      enableFileUpload: true,
      enableFullscreenVideo: true,
      enablePushNotifications: false,
      enableOfflineMode: false,
      themeColor: '#6366f1',
    }
  })

  const url = watch('url')
  const themeColor = watch('themeColor')

  const onAnalyze = async () => {
    if (!url) return
    setIsAnalyzing(true)
    try {
      const result = await analyzeWebsite(url)
      setAnalysisResult(result)
      if (result.suggestedName) {
        setValue('appName', result.suggestedName)
      }
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const onSubmit = async (data: FormData) => {
    // Handle form submission
    console.log({ ...data, icon: iconFile, splash: splashFile, analysis: analysisResult })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <div className="glassmorphism rounded-2xl p-6 space-y-6">
          <h2 className="text-2xl font-bold gradient-text">Configure Your App</h2>
          
          {/* URL Input with AI Analysis */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Website URL
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  {...register('url')}
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border border-purple-500/30 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  placeholder="https://example.com"
                />
              </div>
              <NeonButton
                onClick={onAnalyze}
                disabled={isAnalyzing || !url}
                className="px-6"
              >
                {isAnalyzing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
              </NeonButton>
            </div>
            {errors.url && (
              <p className="text-sm text-red-400">{errors.url.message}</p>
            )}
          </div>

          {/* AI Analysis Results */}
          <AnimatePresence>
            {analysisResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl"
              >
                <h3 className="font-semibold text-purple-400 mb-2">AI Analysis Results</h3>
                <p className="text-sm text-gray-300">{analysisResult.description}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {analysisResult.tags?.map((tag: string) => (
                    <span key={tag} className="px-2 py-1 bg-purple-500/20 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* App Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              App Name
            </label>
            <input
              type="text"
              {...register('appName')}
              className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              placeholder="My Awesome App"
            />
            {errors.appName && (
              <p className="text-sm text-red-400">{errors.appName.message}</p>
            )}
          </div>

          {/* Package Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Package Name
            </label>
            <input
              type="text"
              {...register('packageName')}
              className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              placeholder="com.example.myapp"
            />
            {errors.packageName && (
              <p className="text-sm text-red-400">{errors.packageName.message}</p>
            )}
          </div>

          {/* Icon Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              App Icon
            </label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                {iconFile ? (
                  <img src={URL.createObjectURL(iconFile)} alt="Icon" className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <Upload className="w-6 h-6 text-white" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setIconFile(e.target.files?.[0] || null)}
                className="flex-1 px-4 py-3 bg-black/50 border border-purple-500/30 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600"
              />
            </div>
          </div>

          {/* Splash Screen Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Splash Screen
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSplashFile(e.target.files?.[0] || null)}
              className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600"
            />
          </div>

          {/* Theme Color */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Theme Color
            </label>
            <div className="flex gap-4 items-center">
              <input
                type="color"
                {...register('themeColor')}
                className="w-16 h-10 rounded-lg bg-transparent border border-purple-500/30"
              />
              <input
                type="text"
                {...register('themeColor')}
                className="flex-1 px-4 py-3 bg-black/50 border border-purple-500/30 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                placeholder="#6366f1"
              />
            </div>
          </div>

          {/* Feature Toggles */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-300">Advanced Features</h3>
            
            {[
              { name: 'enableFileDownload', label: 'Enable File Download' },
              { name: 'enableFileUpload', label: 'Enable File Upload' },
              { name: 'enableFullscreenVideo', label: 'Enable Fullscreen Video' },
              { name: 'enablePushNotifications', label: 'Enable Push Notifications' },
              { name: 'enableOfflineMode', label: 'Enable Offline Mode' },
            ].map((feature) => (
              <label key={feature.name} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register(feature.name as keyof FormData)}
                  className="w-5 h-5 rounded border-purple-500/30 bg-black/50 text-purple-500 focus:ring-purple-500"
                />
                <span className="text-gray-300">{feature.label}</span>
              </label>
            ))}
          </div>

          {/* Generate Button */}
          <NeonButton
            onClick={handleSubmit(onSubmit)}
            className="w-full py-4 text-lg"
          >
            <Smartphone className="w-5 h-5 mr-2" />
            Generate APK
          </NeonButton>
        </div>
      </motion.div>

      {/* Live Preview */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="sticky top-6"
      >
        <PreviewPhone
          url={url}
          themeColor={themeColor}
          splashScreen={splashFile}
        />
      </motion.div>
    </div>
  )
}