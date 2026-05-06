import type { ActionItem } from '@/data/projects'

export function ActionItemList({ items }: { items: ActionItem[] }) {
  const done = items.filter((i) => i.done).length

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-warm-900">Action Items</h3>
        <span className="text-xs text-gray-400">
          {done}/{items.length} complete
        </span>
      </div>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-colors ${
              item.done
                ? 'bg-emerald-50/60 text-gray-400'
                : 'bg-white border border-warm-200 text-warm-900'
            }`}
          >
            <div className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded flex items-center justify-center ${
              item.done ? 'bg-emerald-500' : 'border-2 border-warm-200'
            }`}>
              {item.done && (
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
                  <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span className={item.done ? 'line-through' : ''}>{item.text}</span>
              {item.owner && (
                <span className="ml-2 text-xs text-gray-400">— {item.owner}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
