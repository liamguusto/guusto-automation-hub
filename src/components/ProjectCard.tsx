import Link from 'next/link'
import type { Project } from '@/data/projects'

const STATUS_BAR: Record<Project['status'], string> = {
  'planning':            'bg-gray-300',
  'in-progress':         'bg-gradient-to-r from-[#53C2BE] to-[#6DCFCC]',
  'research-complete':   'bg-blue-500',
  'live':                'bg-emerald-500',
}

const STATUS_CONFIG: Record<Project['status'], { label: string; dot: string; badge: string }> = {
  'planning':            { label: 'Planning',           dot: 'bg-gray-400',                      badge: 'bg-gray-100 text-gray-600 ring-gray-200' },
  'in-progress':         { label: 'In Progress',        dot: 'bg-amber-500 animate-pulse',        badge: 'bg-amber-50 text-amber-700 ring-amber-200' },
  'research-complete':   { label: 'Research Complete',  dot: 'bg-blue-500',                       badge: 'bg-blue-50 text-blue-700 ring-blue-200' },
  'live':                { label: 'Live',               dot: 'bg-emerald-500',                    badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
}

export function ProjectCard({ project }: { project: Project }) {
  const doneCount = project.actionItems.filter((i) => i.done).length
  const totalCount = project.actionItems.length
  const blockers  = project.roadblocks?.length ?? 0
  const s         = STATUS_CONFIG[project.status]

  return (
    <Link href={`/projects/${project.slug}`} className="group block h-full">
      <div className="card-lift h-full bg-white rounded-2xl border border-warm-200 overflow-hidden shadow-sm flex flex-col">

        {/* Coloured status bar */}
        <div className={`h-1 flex-shrink-0 ${STATUS_BAR[project.status]}`} />

        <div className="flex flex-col gap-4 p-5 flex-1">

          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-semibold text-warm-900 text-sm leading-snug group-hover:text-[#53C2BE] transition-colors">
              {project.title}
            </h2>
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ring-1 ring-inset flex-shrink-0 ${s.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
              {s.label}
            </span>
          </div>

          {/* Progress */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-bold text-warm-900 tabular-nums">{project.progress}%</span>
              <span className="text-[11px] text-gray-400">{doneCount}/{totalCount} tasks</span>
            </div>
            <div className="w-full bg-warm-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-1.5 rounded-full progress-bar-fill"
                style={{ width: `${project.progress}%`, background: 'linear-gradient(90deg, #53C2BE, #6DCFCC)' }}
              />
            </div>
            <p className="mt-1.5 text-[11px] text-gray-500 leading-snug line-clamp-2">
              {project.currentMilestone}
            </p>
          </div>

          {/* Highlights */}
          {project.highlights && (
            <div className="flex flex-wrap gap-1">
              {project.highlights.map((h) => (
                <span key={h} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-warm-100 text-warm-700 border border-warm-200">
                  {h}
                </span>
              ))}
            </div>
          )}

          {/* Stats + blockers */}
          <div className="flex items-center gap-2 text-[11px] text-gray-400">
            <span>Updated {formatDate(project.lastUpdated)}</span>
            {blockers > 0 && (
              <>
                <span className="text-warm-200">·</span>
                <span className="text-amber-600 font-medium">{blockers} blocker{blockers > 1 ? 's' : ''}</span>
              </>
            )}
          </div>

          {/* Bottom: tech + CTA */}
          <div className="mt-auto pt-3 border-t border-warm-100 flex items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1 min-w-0 flex-1">
              {project.tech.slice(0, 3).map((t) => (
                <span key={t} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-warm-100 text-warm-700">
                  {t}
                </span>
              ))}
              {project.tech.length > 3 && (
                <span className="px-1.5 py-0.5 text-[10px] text-gray-400">+{project.tech.length - 3}</span>
              )}
            </div>
            <span className="text-xs font-semibold text-[#53C2BE] group-hover:underline flex-shrink-0 transition-colors">
              View →
            </span>
          </div>

        </div>
      </div>
    </Link>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })
}
