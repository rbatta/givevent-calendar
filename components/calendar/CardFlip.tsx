'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface CardFlipProps {
  isFlipped: boolean
  front: ReactNode
  back: ReactNode
  onClick?: () => void
}

export function CardFlip({ isFlipped, front, back, onClick }: CardFlipProps) {
  return (
    <div className="relative w-full h-full perspective-1000" onClick={onClick}>
      <motion.div
        className="relative w-full h-full transform-style-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Front */}
        <div
          className="absolute w-full h-full backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {front}
        </div>

        {/* Back */}
        <div
          className="absolute w-full h-full backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  )
}
