// components/trending-apps.tsx
'use client'

import { motion } from 'framer-motion'
import { Download, Heart, Eye, TrendingUp } from 'lucide-react'
import { NeonButton } from './ui/neon-button'

const trendingApps = [
  {
    id: 1,
    name: 'News Daily',
    url: 'news-daily.com',
    downloads: 15234,
    likes: 2341,
    icon: '/icons/news.png',
    category: 'News',
  },
  {
    id: 2,
    name: 'Shop Local',
    url: 'shop-local.com',
    downloads: 12345,
    likes: 1892,
    icon: '/icons/shop.png',
    category: 'E-commerce',
  },
  {
    id: 3,
    name: 'Travel Guide',
    url: 'travel-guide.com',
    downloads: 9876,
    likes: 1543,
    icon: '/icons/travel.png',
    category: 'Travel',
  },
  {
    id: 4,
    name: 'Fitness Tracker',
    url: 'fitness-tracker.com',
    downloads: 8765,
    likes: 1234,
    icon: '/icons/fitness.png',
    category: 'Health',
  },
]

export function TrendingApps() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 glassmorphism rounded-full mb-4">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-300">Trending Now</span>
          </div>
          <h2 className="text-4xl font-bold gradient-text">Most Downloaded Apps</h2>
          <p className="text-gray-400 mt-4">Join thousands of creators who built their apps with us</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingApps.map((app, index) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="glassmorphism rounded-2xl p-6 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500" />
                <div>
                  <h3 className="font-semibold">{app.name}</h3>
                  <p className="text-sm text-gray-400">{app.url}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                <span className="px-2 py-1 bg-purple-500/20 rounded-full text-purple-400">
                  {app.category}
                </span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    {app.downloads.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {app.likes.toLocaleString()}
                  </span>
                </div>
              </div>
              
              <NeonButton size="sm" className="w-full">
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </NeonButton>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}