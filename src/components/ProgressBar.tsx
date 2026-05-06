'use client'

import { useEffect, useRef } from 'react'

interface ProgressBarProps {
  progress: number
  milestone: string
  size?: 'sm' | 'md'
}

export function ProgressBar({ progress, milestone, size = 'md' }: ProgressBarProps) {
  const fillRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (fillRef.current) {
      fillRef.current.style.width = `${progress}%`
    }
  }, [progress])

  const h = size === 'sm' ? 'h-1.5' : 'h-2'

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-medium text-warm-700 tabular-nums">{progress}%</span>
      </div>
      <div className={`w-full bg-warm-100 rounded-full ${h} overflow-hidden`}>
        <div
          ref={fillRef}
          className={`${h} rounded-full progress-bar-fill`}
          style={{
            width: 0,
            background: 'linear-gradient(90deg, #53C2BE, #6DCFCC)',
          }}
        />
      </div>
      {milestone && (
        <p className="mt-1.5 text-xs text-gray-500 leading-snug">{milestone}</p>
      )}
    </div>
  )
}
