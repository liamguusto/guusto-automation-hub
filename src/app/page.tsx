import { projects } from '@/data/projects'
import { ProjectCard } from '@/components/ProjectCard'
import { Header } from '@/components/Header'

const STATUS_BAR: Record<string, string> = {
  'planning':          'bg-gray-300',
  'in-progress':       'bg-gradient-to-r from-[#53C2BE] to-[#6DCFCC]',
  'research-complete': 'bg-blue-500',
  'live':              'bg-emerald-500',
}

export default function Home() {
  const inProgress       = projects.filter((p) => p.status === 'in-progress').length
  const researchComplete = projects.filter((p) => p.status === 'research-complete').length
  const planning         = projects.filter((p) => p.status === 'planning').length
  const live             = projects.filter((p) => p.status === 'live').length
  const lastUpdated      = projects.map((p) => p.lastUpdated).sort().at(-1)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">

        {/* Page hero */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-warm-900 tracking-tight mb-1">
            Active Projects
          </h1>
          <p className="text-sm text-gray-500 mb-5 max-w-xl">
            AI systems, automation pipelines, and outbound campaigns in flight.
            {lastUpdated && (
              <span className="text-gray-400"> Last updated {formatDate(lastUpdated)}.</span>
            )}
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-2">
            <StatChip color="from-[#53C2BE] to-[#6DCFCC]" value={projects.length} label="Projects" />
            {inProgress > 0       && <StatChip color="from-amber-400 to-amber-500" value={inProgress}       label="In Progress" />}
            {researchComplete > 0 && <StatChip color="from-blue-400 to-blue-500"   value={researchComplete} label="Research Complete" />}
            {planning > 0         && <StatChip color="from-gray-300 to-gray-400"   value={planning}         label="Planning" />}
            {live > 0             && <StatChip color="from-emerald-400 to-emerald-500" value={live}         label="Live" />}
          </div>
        </div>

        {/* Project grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </main>

      <footer className="border-t border-warm-200 py-5 mt-4">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between text-xs text-gray-400">
          <span>Guusto GTM Automation Hub</span>
          <span>Internal use only</span>
        </div>
      </footer>
    </div>
  )
}

function StatChip({ color, value, label }: { color: string; value: number; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-white border border-warm-200 shadow-sm">
      <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
        <span className="text-[10px] font-bold text-white leading-none">{value}</span>
      </div>
      <span className="text-xs font-medium text-warm-700">{label}</span>
    </div>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-CA', { month: 'long', day: 'numeric', year: 'numeric' })
}
