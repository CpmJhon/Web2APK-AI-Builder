// components/ui/neon-button.tsx
'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
}

export const NeonButton = forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          'relative rounded-xl font-semibold transition-all duration-300',
          'bg-gradient-to-r from-purple-600 to-pink-600 text-white',
          'hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2 text-base': size === 'md',
            'px-6 py-3 text-lg': size === 'lg',
            'bg-opacity-90': variant === 'secondary',
          },
          className
        )}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center">
          {children}
        </span>
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
      </motion.button>
    )
  }
)

NeonButton.displayName = 'NeonButton'