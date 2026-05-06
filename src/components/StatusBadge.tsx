import type { Status } from '@/data/projects'

const config: Record<Status, { label: string; className: string }> = {
  planning:           { label: 'Planning',           className: 'bg-gray-100 text-gray-600 ring-gray-200' },
  'in-progress':      { label: 'In Progress',        className: 'bg-amber-50 text-amber-700 ring-amber-200' },
  'research-complete':{ label: 'Research Complete',  className: 'bg-blue-50 text-blue-700 ring-blue-200' },
  live:               { label: 'Live',               className: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
}

const dotColor: Record<Status, string> = {
  planning:            'bg-gray-400',
  'in-progress':       'bg-amber-500 animate-pulse',
  'research-complete': 'bg-blue-500',
  live:                'bg-emerald-500',
}

export function StatusBadge({ status }: { status: Status }) {
  const { label, className } = config[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor[status]}`} />
      {label}
    </span>
  )
}
