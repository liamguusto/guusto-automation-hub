import type { VersionPhase } from '@/data/projects'

const phaseStyle: Record<VersionPhase['status'], { ring: string; dot: string; bg: string; text: string }> = {
  done:    { ring: 'ring-emerald-300', dot: 'bg-emerald-500', bg: 'bg-emerald-50',  text: 'text-emerald-700' },
  current: { ring: 'ring-coral',       dot: 'bg-coral',       bg: 'bg-coral-light', text: 'text-coral-dark'  },
  planned: { ring: 'ring-warm-200',    dot: 'bg-warm-200',    bg: 'bg-warm-50',     text: 'text-gray-400'    },
}

export function VersionRoadmap({ phases }: { phases: VersionPhase[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-warm-900 mb-4">Roadmap</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {phases.map((phase) => {
          const s = phaseStyle[phase.status]
          return (
            <div
              key={phase.label}
              className={`rounded-xl p-4 ring-1 ${s.ring} ${s.bg} relative`}
            >
              {phase.status === 'current' && (
                <span className="absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-wider text-coral bg-coral-light px-1.5 py-0.5 rounded-full ring-1 ring-coral/20">
                  Now
                </span>
              )}
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${s.dot}`} />
                <span className={`text-xs font-bold uppercase tracking-widest ${s.text}`}>{phase.label}</span>
              </div>
              <p className="text-xs font-medium text-warm-900 mb-2">{phase.description}</p>
              <ul className="space-y-1">
                {phase.features.map((f, i) => (
                  <li key={i} className="text-xs text-gray-500 flex items-start gap-1.5">
                    <span className="mt-0.5 text-warm-200 flex-shrink-0">›</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
