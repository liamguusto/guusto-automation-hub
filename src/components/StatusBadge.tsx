import type { Status } from '@/data/projects'

const config: Record<Status, { label: string; badge: string; dot: string }> = {
  'planning':            { label: 'Planning',           badge: 'bg-gray-100 text-gray-600 ring-gray-200',           dot: 'bg-gray-400' },
  'in-progress':         { label: 'In Progress',        badge: 'bg-amber-50 text-amber-700 ring-amber-200',         dot: 'bg-amber-500 animate-pulse' },
  'research-complete':   { label: 'Research Complete',  badge: 'bg-blue-50 text-blue-700 ring-blue-200',            dot: 'bg-blue-500' },
  'live':                { label: 'Live',               badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200',   dot: 'bg-emerald-500' },
}

export function StatusBadge({ status }: { status: Status }) {
  const { label, badge, dot } = config[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
      {label}
    </span>
  )
}
