import Link from 'next/link'
import type { Project } from '@/data/projects'
import { StatusBadge } from './StatusBadge'
import { ProgressBar } from './ProgressBar'
import { TechStack } from './TechStack'

export function ProjectCard({ project }: { project: Project }) {
  const doneCount = project.actionItems.filter((i) => i.done).length
  const totalCount = project.actionItems.length
  const blockers = project.roadblocks?.length ?? 0

  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <div className="card-lift h-full bg-white rounded-2xl border border-warm-200 p-5 flex flex-col gap-4 shadow-sm">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-semibold text-warm-900 text-sm leading-snug group-hover:text-[#53C2BE] transition-colors">
            {project.shortTitle}
          </h2>
          <StatusBadge status={project.status} />
        </div>

        {/* Progress */}
        <ProgressBar
          progress={project.progress}
          milestone={project.currentMilestone}
          size="sm"
        />

        {/* Meta row */}
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span>{doneCount}/{totalCount} actions done</span>
          {blockers > 0 && (
            <>
              <span>·</span>
              <span className="text-amber-600 font-medium">
                {blockers} blocker{blockers > 1 ? 's' : ''}
              </span>
            </>
          )}
          <span className="ml-auto">Updated {formatDate(project.lastUpdated)}</span>
        </div>

        {/* Tech + CTA */}
        <div className="flex items-end justify-between gap-3 mt-auto pt-1 border-t border-warm-100">
          <div className="flex-1 min-w-0">
            <TechStack tech={project.tech.slice(0, 4)} />
          </div>
          <span className="text-xs font-semibold text-[#53C2BE] group-hover:underline flex-shrink-0">
            View →
          </span>
        </div>
      </div>
    </Link>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })
}
