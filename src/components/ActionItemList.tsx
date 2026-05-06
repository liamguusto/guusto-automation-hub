'use client'

import { useState, useEffect } from 'react'
import type { ActionItem } from '@/data/projects'

function storageKey(slug: string, index: number) {
  return `guusto-hub-${slug}-item-${index}`
}

export function ActionItemList({ items, projectSlug }: { items: ActionItem[]; projectSlug: string }) {
  const [checked, setChecked] = useState<boolean[]>(() => items.map((i) => i.done))

  useEffect(() => {
    setChecked(
      items.map((item, i) => {
        const saved = localStorage.getItem(storageKey(projectSlug, i))
        return saved !== null ? saved === 'true' : item.done
      })
    )
  }, [projectSlug, items])

  function toggle(index: number) {
    setChecked((prev) => {
      const next = [...prev]
      next[index] = !next[index]
      localStorage.setItem(storageKey(projectSlug, index), String(next[index]))
      return next
    })
  }

  const doneCount = checked.filter(Boolean).length

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-warm-900">Action Items</h3>
        <span className="text-xs text-gray-400">{doneCount}/{items.length} complete</span>
      </div>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className={`w-full flex items-start gap-3 px-3.5 py-2.5 rounded-lg text-sm text-left transition-all cursor-pointer ${
              checked[i]
                ? 'bg-emerald-50/60 text-gray-400'
                : 'bg-white border border-warm-200 text-warm-900 hover:border-[#53C2BE]/40 hover:bg-warm-50'
            }`}
          >
            <div
              className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded transition-colors flex items-center justify-center ${
                checked[i] ? 'bg-emerald-500' : 'border-2 border-warm-200'
              }`}
            >
              {checked[i] && (
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
                  <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span className={checked[i] ? 'line-through' : ''}>{item.text}</span>
              {item.owner && (
                <span className="ml-2 text-xs text-gray-400">— {item.owner}</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
