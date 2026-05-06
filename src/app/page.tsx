import { projects } from '@/data/projects'
import { ProjectCard } from '@/components/ProjectCard'
import { Header } from '@/components/Header'

export default function Home() {
  const inProgress = projects.filter((p) => p.status === 'in-progress').length
  const lastUpdated = projects
    .map((p) => p.lastUpdated)
    .sort()
    .at(-1)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
        {/* Page heading */}
        <div className="mb-8">
          <div className="flex items-baseline gap-3 mb-1">
            <h1 className="text-2xl font-bold text-warm-900 tracking-tight">Active Projects</h1>
            <span className="text-sm text-gray-400">
              {projects.length} projects · {inProgress} in progress
            </span>
          </div>
          <p className="text-gray-500 text-sm max-w-2xl">
            Automation pipelines, AI systems, and outbound campaigns currently in flight.
            {lastUpdated && (
              <span className="text-gray-400"> Last updated {formatDate(lastUpdated)}.</span>
            )}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-warm-200 py-5">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between text-xs text-gray-400">
          <span>Guusto GTM Automation Hub</span>
          <span>Internal use only</span>
        </div>
      </footer>
    </div>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-CA', { month: 'long', day: 'numeric', year: 'numeric' })
}
