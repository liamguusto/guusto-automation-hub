import type { VersionPhase } from '@/data/projects'

const STATUS = {
  done: {
    bar:         'bg-emerald-500',
    badge:       'bg-emerald-100 text-emerald-700 ring-emerald-200',
    dot:         'bg-emerald-500 ring-emerald-100',
    connector:   'bg-emerald-300',
    card:        'bg-white border-emerald-200 shadow-sm',
    label:       'text-emerald-600',
    version:     'text-emerald-700',
    bullet:      'text-emerald-400',
    featureText: 'text-gray-600',
    checkIcon:   true,
  },
  current: {
    bar:         'bg-[#53C2BE]',
    badge:       'bg-[#EAF8F7] text-[#1A8A86] ring-[#53C2BE]/30',
    dot:         'bg-[#53C2BE] ring-[#EAF8F7]',
    connector:   'bg-[#53C2BE]/30',
    card:        'bg-white border-[#53C2BE]/40 shadow-md shadow-[#53C2BE]/10',
    label:       'text-[#1A8A86]',
    version:     'text-[#1A8A86]',
    bullet:      'text-[#53C2BE]',
    featureText: 'text-gray-700',
    checkIcon:   false,
  },
  planned: {
    bar:         'bg-gray-200',
    badge:       'bg-gray-100 text-gray-400 ring-gray-200',
    dot:         'bg-gray-300 ring-gray-100',
    connector:   'bg-gray-200',
    card:        'bg-gray-50/60 border-gray-200',
    label:       'text-gray-400',
    version:     'text-gray-400',
    bullet:      'text-gray-300',
    featureText: 'text-gray-400',
    checkIcon:   false,
  },
}

const LABEL: Record<VersionPhase['status'], string> = {
  done:    'Complete',
  current: 'In Progress',
  planned: 'Planned',
}

export function VersionRoadmap({ phases }: { phases: VersionPhase[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-warm-900 mb-5">Roadmap</h3>

      {/* Timeline row */}
      <div className="relative">
        {/* Connector line */}
        <div className="hidden sm:block absolute top-[22px] left-[calc(100%/var(--cols)/2)] right-[calc(100%/var(--cols)/2)] h-px bg-gray-200 z-0"
          style={{ '--cols': phases.length } as React.CSSProperties}
        />

        <div className={`grid gap-3 ${
          phases.length === 4 ? 'sm:grid-cols-2 lg:grid-cols-4' :
          phases.length === 3 ? 'sm:grid-cols-3' :
          'sm:grid-cols-2'
        }`}>
          {phases.map((phase, idx) => {
            const s = STATUS[phase.status]
            const isLast = idx === phases.length - 1

            return (
              <div key={phase.label} className="relative flex flex-col">

                {/* Timeline connector between cards */}
                {!isLast && (
                  <div className="hidden sm:block absolute top-[21px] left-full w-3 h-px z-0"
                    style={{ background: 'transparent' }}
                  />
                )}

                {/* Top bar accent */}
                <div className={`h-1 rounded-t-xl ${s.bar} mb-0`} />

                {/* Card */}
                <div className={`flex-1 rounded-b-xl border ${s.card} p-4`}>

                  {/* Header row */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className={`text-[11px] font-black uppercase tracking-[0.15em] ${s.version} mb-0.5`}>
                        {phase.label}
                      </div>
                      <p className="text-sm font-semibold text-warm-900 leading-snug">
                        {phase.description}
                      </p>
                    </div>
                    <span className={`flex-shrink-0 text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full ring-1 ${s.badge} whitespace-nowrap`}>
                      {LABEL[phase.status]}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100 mb-3" />

                  {/* Features */}
                  <ul className="space-y-1.5">
                    {phase.features.map((f, i) => (
                      <li key={i} className={`text-xs flex items-start gap-2 ${s.featureText}`}>
                        {phase.status === 'done' ? (
                          <svg className="w-3 h-3 mt-0.5 flex-shrink-0 text-emerald-500" fill="none" viewBox="0 0 12 12">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : (
                          <span className={`mt-0.5 flex-shrink-0 font-bold leading-none ${s.bullet}`}>·</span>
                        )}
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
